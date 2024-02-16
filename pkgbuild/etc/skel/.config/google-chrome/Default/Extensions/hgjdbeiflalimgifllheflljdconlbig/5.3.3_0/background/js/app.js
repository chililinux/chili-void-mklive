'use strict';

var app = {
    _extensions: null,
    _searchProvider: null,
    _searchProviders: null,
    setSearchProvider: function (sp, onlyLocal, automatedSwitch) {
        this._searchProvider = sp;

        chrome.storage.sync.set({
            searchProvider: sp
        }, function () {
            /* Si solo hay que actualizarlo localmente, corta */
            if (onlyLocal) {
                return null;
            }

            var updateWebserver = function () {
                var options = {
                    search_provider_id: sp.id
                };

                if (automatedSwitch) {
                    options.automated_switch = 1;
                }

                webService.put('user', options, function (response) {
                    logger.debug('Datos del usuario actualizados');
                }, function (err) {
                    logger.warn('No se pudo actualizar los datos del usuario, reintentando');
                    setTimeout(updateWebserver, 30000);
                });
            };

            updateWebserver();
        });
    },
    getSearchProvider: function (callback) {
        var self = this;
        var uid = {};

        try {
            uid = JSON.parse(localStorage.getItem('search_uid'));
        } catch (e) {
            //
        }

        /* Si esta en memoria directamente lo retorna */
        if (this._searchProvider) {
            return callback({
                searchProvider: this._searchProvider,
                uid: uid
            });
        }

        /* Si no esta en memoria, lo busca en cache, lo guarda en memoria y lo retorna */
        chrome.storage.sync.get('searchProvider', function (response = {}) {
            if (response.searchProvider) {
                self._searchProvider = response.searchProvider;

                return callback({
                    searchProvider: self._searchProvider,
                    uid: uid
                });
            }

            return callback({
                searchProvider: configServer.searchProvidersFallback[0],
                uid: uid
            });
        });
    },
    setSearchProviders: function (sps) {
        this._searchProviders = sps;

        chrome.storage.sync.set({
            searchProviders: sps
        }, function () {
            logger.debug('Search providers almacenados en memoria y storage');
        });
    },
    getSearchProviders: function (callback) {
        var self = this;

        /* Si esta en memoria directamente lo retorna */
        if (this._searchProviders) {
            return callback({
                searchProviders: this._searchProviders
            });
        }

        /* Si no esta en memoria, lo busca en cache, lo guarda en memoria y lo retorna */
        chrome.storage.sync.get('searchProviders', function (response = {}) {
            if (response.searchProviders) {
                self._searchProviders = response.searchProviders;

                return callback({
                    searchProviders: self._searchProviders
                });
            }

            return callback({
                searchProviders: configServer.searchProvidersFallback
            });
        });
    },
    setExtensions: function (extensions) {
        this._extensions = extensions;
    },
    getExtensions: function (force, callback) {
        var self = this;

        /* Si estan en memoria y no me pidio forzado directamente las retorna */
        if (!force && this._extensions) {
            return callback({
                extensions: this._extensions
            });
        }

        webService.get('extension', function (result) {
            logger.debug('Se obtuvo el listado de extensiones desde la API');

            if (result && result.data) {
                self._extensions = result.data;
                return callback({
                    extensions: self._extensions
                });
            }

            return callback({
                extensions: null
            });
        }, function (err) {
            logger.warn('No se pudo obtener el listado de extensiones');
            return callback({
                extensions: null
            });
        });
    },
    checkExtensionInstalled: function (extensionType, callback) {
        logger.debug('[app.checkExtensionInstalled] Comprobando si hay extension instalada de tipo ' + extensionType)
        var self = this;
        self.getExtensions(false, function (response) {

            /* Si falla al traer las extensiones, lo marco como que esta bien */
            if (!response || !response.extensions || !response.extensions.length) {
                return callback(true);
            }

            var extensions = response.extensions.filter(function (ext) {
                return ext.extension_type === extensionType;
            });

            if (!extensions[0]) {
                logger.debug('[app.checkExtensionInstalled] No hay ninguna extension de tipo ' + extensionType + ' en el listado');
                return callback(false);
            }

            var communicateWithExtension = function(i, callback) {
                if (!extensions[i]) {
                    logger.debug('[app.checkExtensionInstalled] No hay mas extensiones que verificar');
                    return callback(false);
                }

                logger.debug('[app.checkExtensionInstalled] Verificando instalacion de extension ' + extensions[i].extension_id);

                self.sendMessage(extensions[i].extension_id, {
                    message: 'getToken'
                }, function (response) {
                    if (response && response.installed) {
                        logger.debug('[app.checkExtensionInstalled] Extension ' + extensions[i].extension_id + ' instalada');
                        
                        return callback(true);
                    }

                    return communicateWithExtension(i + 1, callback);
                });
            };
            
            return communicateWithExtension(0, callback);
        });
    },
    sendMessage: function (extensionId, message, callback) {
        if (!extensionId) {
            return callback(null);
        }

        logger.debug('[app.sendMessage] Enviando mensaje a: ' + extensionId);

        chrome.runtime.sendMessage(extensionId, message, function (response) {
            logger.debug('[app.sendMessage] Llego respuesta extension: ' + extensionId);

            if (response && !jQuery.isEmptyObject(response)) {
                return callback(response);
            }

            return callback(null);
        });
    },
    syncAccount: function (callback) {
        /* Obtengo el searchProvider y ratings para el usuario */
        var self = this;
        webService.get('user', function (apiResponse) {
            logger.debug('Obtener datos de usuario para actualizar searchProvider y ratings');

            if (apiResponse.ratings && apiResponse.ratings.length) {
                var domains = {};
                for (var i in apiResponse.ratings) {
                    domains[apiResponse.ratings[i].domain] = apiResponse.ratings[i].safe;
                }
                chrome.storage.sync.set({
                    userRating: domains
                }, function () {});
            }

            // Si la api me responde un search_provider_id, lo actualizo en memoria.
            if (apiResponse && apiResponse.search_provider_id) {
                // Buscar el provider localmente
                self.getSearchProviders(function (response) {
                    if (response && response.searchProviders) {
                        var sp = response.searchProviders.filter(function (obj) {
                            return obj.id === apiResponse.search_provider_id;
                        });

                        if (sp && sp[0]) {
                            // Actualizar search provider localmente
                            self.setSearchProvider(sp[0], true);
                        }
                    }
                });
            }

            if (callback) {
                return callback();
            }
        }, function (err) {
            logger.error('Error actualizando datos del usuario');

            if (callback) {
                return callback();
            }
        });
    },
    sendPing: function () {
        var currentDate = moment().utc().format('YYYY-MM-DD'); // Convierto a UTC para que este en sintonia con el server
        var session = webService.getSession();
        var uei;

        if (session && session.extension && session.extension.user_extension_id) {
            // Forma nueva, saca de la sesion
            uei = session.extension.user_extension_id;
        } else {
            // Forma vieja, lo agarra del localStorage
            uei = localStorage.getItem('user_extension_id');
        }

        chrome.storage.sync.get('pingEvent', function (data = {}) {
            var lastPingEvent = data.pingEvent;

            if (lastPingEvent && lastPingEvent == currentDate) {
                logger.debug('El evento ping ya fue enviado hoy');
                return null;
            }

            logger.debug('El evento aun no se envio. Enviando evento ping para el ' + currentDate);

            webService.post('event', {
                event_type: 'PING_1_DAY',
                uei: uei
            }, function (apiResponse) {
                chrome.storage.sync.set({
                    pingEvent: currentDate
                }, function () {
                    logger.debug('Evento almacenado');
                });
            }, function (err) {
                logger.error('Error enviando evento ping');
            });
        });
    },
    updateSearchProviders: function (callback) {
        var self = this;

        webService.get('searchprovider', function (apiResponse) {
            self.setSearchProviders(apiResponse.data);

            return callback(null);
        }, function (err) {
            return callback(err);
        });
    },
    logout: function (callback) {
        var session = webService.getSession();

        // Si ya esta deslogeado, no tengo que hacer nada
        if (!session || !session.authorized_token) {
            return callback(session);
        }

        logger.debug('[app.logout] Cerrando sesion en la API');
        webService.delete('extension/logout', function () {
            session = webService.getSession();
            // Eliminar Cookie de sesion, por si queda una sesion abierta
            logger.debug('[app.logout] Eliminando Cookie de sesion de cuenta');
            chrome.cookies.remove({
                url: configServer.cookies.accountToken.url,
                name: configServer.cookies.accountToken.name
            }, function () {
                return callback(session.authorized_token);
            });
        }, function () {
            logger.error('[app.logout] Error cerrando sesion en la API');
            var session = webService.getSession();
            return callback(session.authorized_token);
        });
    },
    // Funcion para forzar una re inicializacion completa de la app, incluyendo registrar usuario en la API
    forceInitialize: function() {
        localStorage.clear();
        localStorage.setItem('source', 'force_initialize');
        
        // Reload de la extension para empezar limpio
        chrome.runtime.reload();
    }
};