'use strict';

const handler = {
    /**
     * Objeto para guardar el ultimo de evento de busqueda enviado
     */
    last_event: {},

    // -------------------------------------------------------------------------------------
    // SESSION
    // -------------------------------------------------------------------------------------
    /**
     * @description Comprobar si un usuario esta logeado. Se utiliza desde el Popup.
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    checkLogged: function (message, request, callback) {
        var session = webService.getSession();
        if (session.authorized_token) {
            callback({
                name: session.account_name,
                email: session.account_email,
                picture: session.account_avatar_url,
                logged: true
            });
        } else {
            callback({
                logged: false
            });
        }
    },
    /**
     * @description Obtener la sesion y el token actual
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    getSession: function (message, request, callback) {
        return callback({
            session: webService.getSession(),
            token: webService.getToken()
        });
    },
    /**
     * @description Iniciar sesion en la API
     * @param {Object} message - Informacion necesaria para hacer la consulta
     *        {String} message.hash - Hash para enlazar exta extensión con una cuenta 
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    login: function (message, request, callback) {
        logger.debug('[handler.login] Ejecutando login');
        var hash = message.hash;
        webService.post('extension/login', {
            login_hash: hash
        }, function () {
            logger.debug('[handler.login] Login terminado');
            var session = webService.getSession();
            return callback(session.authorized_token);
        }, function (err) {
            logger.error('[handler.login] Error realizando login');
        });
    },
    /**
     * @description Cerrar sesion en la API. No desenlaza la cuenta, solo deslogea.
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    logout: function (message, request, callback) {
        logger.debug('[handler.logout] Ejecutando logout');
        app.logout(function (session) {
            logger.debug('[handler.logout] Broadcast al resto de las extensiones');
            Communication.broadcast({
                action: 'logout'
            }, function () {
                logger.debug('[handler.logout] Logout terminado');
                return callback(session);
            });
        });
    },
    /**
     * @description Refrescar la sesion
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    refreshSession: function (message, request, callback) {
        logger.debug('Refrescando sesion');
        // Se hace un PUT de usuario ya que en esa llamada se regenera la sesion.
        webService.put('user', {}, function (apiResponse) {
            logger.debug('Refrescando planes del usuario');
            app.getPlans(true, function () {
                return callback({
                    session: webService.getSession(),
                    token: webService.getToken()
                });
            });
        }, function (err) {
            logger.error('Error actualizando datos del usuario');
        });
    },

    // -------------------------------------------------------------------------------------


    /**
     * @description Obtiene la url de la tab activa
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    getWindowUrl: function (message, request, callback) {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            var tab = tabs[0];
            callback(tab.url);
        });
    },
    /**
     * @description Obtiene el rating de un dominio y actualiza el icono del tab
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - Informacion del tab cuando se consulta desde un content script
     * @param {Function} callback - funcion para manejar la respuesta
     */
    getRating: function (message, request, callback) {
        var tab;
        /* Si se llama desde un content script, llega en el request */
        if (request && request.tab) {
            tab = request.tab;
        } else if (message.tab) {
            tab = message.tab;
        }

        /* Verifica si tiene una tab activa y con url */
        if (!tab || !tab.url) {
            return callback({
                error: "NO_ACTIVE_TAB"
            });
        }

        /* Si no esta en cache lo agrega como un objeto sin informacion */
        if (!tabStates[tab.id]) {
            tabStates[tab.id] = {};
        }

        /* Verifica si es una URL valida */
        if (!validateUrl(tab.url)) {
            return callback({
                error: "INVALID_URL"
            });
        }

        var newDomain = parseDomain(tab.url);

        /* Verifica Si pide actualizar forzadamente el rating */
        if (message.force) {
            /* Si lo pide forzadamente consulta a la API */
            webServiceGetRating(newDomain, function (err, response) {
                if (err || !response) {
                    return callback({
                        error: "ERROR_OBTAINING_RATING"
                    });
                }

                /* Guarda la respuesta en memoria y en el cache de chrome */
                saveDomainRating(tab.id, newDomain, response, function (response) {
                    return callback({
                        rating: response
                    });
                });
            });
        } else {
            /* Si ya esta en cache directamente lo retorna */
            if (ratings[newDomain]) {
                var rating = $.extend(true, {}, ratings[newDomain]);
                tabStates[tab.id].rating = rating;

                return callback({
                    rating: rating
                });
            }

            /* Si no esta en cache consulta el rating a la API */
            webServiceGetRating(newDomain, function (err, response) {
                if (err || !response) {
                    return callback({
                        error: "ERROR_OBTAINING_RATING"
                    });
                }

                /* Guarda la respuesta en memoria y en el cache de chrome */
                saveDomainRating(tab.id, newDomain, response, function (response) {
                    return callback({
                        rating: response
                    });
                });
            });
        }
    },

    /**
     * @description Envia el rating seteado por el usuario a la API
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - Informacion del tab cuando se consulta desde un content script
     * @param {Function} callback - funcion para manejar la respuesta
     */
    sendRating: function (message, request, callback) {
        webService.post('rating', {
            safe: message.safe,
            domain: message.domain
        }, function (response) {
            /* Actualiza el rating local para que quede con la votacion del usuario */
            if (ratings && ratings[message.domain]) {
                ratings[message.domain].user = message.safe;
            }

            /* Obtiene los user rating del cache de chrome */
            chrome.storage.sync.get('userRating', function (data = {}) {
                var domains = data.userRating;

                /* Si no tiene cache, lo setea como objeto vacio para facilitar el uso */
                if (!domains) {
                    domains = {};
                }

                domains[message.domain] = message.safe;

                chrome.storage.sync.set({
                    userRating: domains
                }, function () {
                    return callback({
                        error: false
                    });
                });
            });
        }, function (err) {
            return callback({
                error: true
            });
        });
    },

    /**
     * @description Envia el request a la API para eliminar la votacion del usuario
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - Informacion del tab cuando se consulta desde un content script
     * @param {Function} callback - funcion para manejar la respuesta
     */
    removeRating: function (message, request, callback) {
        webService.delete('rating', {
            domain: message.domain
        }, function (response) {
            /* Actualiza el rating local para que quede con la votacion del usuario */
            if (ratings && ratings[message.domain]) {
                ratings[message.domain].user = null;
            }

            /* Obtiene los user rating del cache de chrome */
            chrome.storage.sync.get('userRating', function (data = {}) {
                var domains = data.userRating;

                /* Si no tiene cache, lo setea como objeto vacio para facilitar el uso */
                if (domains && domains[message.domain]) {
                    domains[message.domain] = null;
                }

                chrome.storage.sync.set({
                    userRating: domains
                }, function () {
                    return callback({
                        error: false
                    });
                });
            });
        }, function (err) {
            return callback({
                error: true
            });
        });
    },

    /**
     * @description Envia el evento de nueva busqueda a la API
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - Informacion del tab cuando se consulta desde un content script
     * @param {Function} callback - funcion para manejar la respuesta
     */
    newSearch: function (message, request, callback) {
        if (this.last_event.type === 'DIRECT_SEARCH' && this.last_event.type !== message.event_type && this.last_event.query === message.query) {
            logger.debug('no se envia el evento [' + message.event_type + '] porque el anterior fue [' + this.last_event.type + ']');

            this.last_event.type = message.event_type,
                this.last_event.query = message.query

            return callback({
                error: false
            });
        }

        this.last_event.type = message.event_type,
            this.last_event.query = message.query

        webService.post('event', {
            event_type: message.event_type,
            query: message.query
        }, function (response) {
            /* Actualiza la cantidad de busquedas que realizo el usuario */
            updateSearch();

            return callback({
                error: false
            });
        }, function (err) {
            /* Actualiza la cantidad de busquedas que realizo el usuario */
            updateSearch();

            return callback({
                error: true
            });
        });
    },

    /**
     * Cambiar el estado de las notificaciones de sitios inseguros
     * @param {Object}              message                 El mensaje que contiene el dominio (si se requiere) y el estado
     *                              -- message.domain       El dominio - solo se envía si se quiere actualizar el estado para el dominio en particular
     *                              -- message.status       El estado - true/false
     * @param {-}                   request                 No se utiliza
     * @param {setNotificationCallback}     callback        Callback de respuesta
     */

    /**
     * @callback setNotificationCallback
     * @param {Boolean}             Siempre llega null, no retorna información
     */
    setNotificationStatus: function (message, request, callback) {
        /* Cambiar el estado para uno en particular */
        if (message.domains && message.domains.length) {
            chrome.storage.sync.get('disabledDomainNotification', function (data = {}) {
                var domains = data.disabledDomainNotification;

                if (!domains) {
                    domains = {};
                }

                /* Si me manda false, pide volver a activar las notificaciones */
                if (!message.status) {
                    for (var domain of message.domains) {
                        delete domains[domain];
                    }

                    chrome.storage.sync.set({
                        'disabledDomainNotification': domains
                    }, function () {
                        updateCurrentTabIcon();
                        return callback();
                    });
                }
                /* Me pide bloquear notificaciones para un sitio */
                else {
                    /* Lo bloqueo y guardo */
                    for (var domain of message.domains) {
                        domains[domain] = true;
                    }

                    chrome.storage.sync.set({
                        'disabledDomainNotification': domains
                    }, function () {
                        updateCurrentTabIcon();
                        return callback();
                    });
                }
            });
        } else {
            chrome.storage.sync.set({
                'disabledNotification': message.status
            }, function () {
                updateCurrentTabIcon();
                return callback();
            });
        }
    },

    /**
     * Cambiar el estado de las notificaciones de actualizacion de turstnav
     * @param {Object}              message                 El mensaje que contiene el dominio (si se requiere) y el estado
     *                              -- message.status       El estado - true/false
     * @param {-}                   request                 No se utiliza
     * @param {setNotificationCallback}     callback        Callback de respuesta
     */

    /**
     * @callback setNotificationCallback
     * @param {Boolean}             Siempre llega null, no retorna información
     */
    setUpdateNotificationStatus: function (message, request, callback) {
        /* Cambiar el estado para uno en particular */
        chrome.storage.sync.set({
            'updateNotifications': message.status
        }, function () {
            return callback();
        });
    },

    /**
     * Cambiar el estado de las notificaciones de actualizacion de turstnav popup
     * @param {Object}              message                 El mensaje que contiene el dominio (si se requiere) y el estado
     *                              -- message.status       El estado - true/false
     * @param {-}                   request                 No se utiliza
     * @param {setNotificationCallback}     callback        Callback de respuesta
     */

    /**
     * @callback setNotificationCallback
     * @param {Boolean}             Siempre llega null, no retorna información
     */
    setUpdateNotificationStatusPopUp: function (message, request, callback) {
        /* Cambiar el estado para uno en particular */
        chrome.storage.sync.set({
            'popupUpdateNotifications': message.status
        }, function () {
            return callback();
        });
    },

    /**
     * Obtener el estado de las notificaciones de sitios inseguros
     * @param {Object}              message                 El mensaje que contiene el dominio (si se requiere)
     *                              -- message.domain       El dominio - solo se envía si se quiere obtener el estado para el dominio en particular
     * @param {-}                   request                 No se utiliza
     * @param {getNotificationCallback}     callback                Callback de respuesta
     */

    /**
     * @callback getNotificationCallback
     * @param {Boolean}             true - notificaciones activadas / false - notificaciones desactivadas
     */
    getNotificationStatus: function (message, request, callback) {
        chrome.storage.sync.get('disabledNotification', function (data = {}) {
            /* Las notificaciones estan activadas */
            if (!data.disabledNotification) {
                /* Si me pidio para un sitio, evaluo si para el sitio estan desactivadas */
                if (message.domain) {
                    chrome.storage.sync.get('disabledDomainNotification', function (dataDomain = {}) {
                        if (!dataDomain.disabledDomainNotification) {
                            /* No hay ningun sitio bloqueado */
                            return callback({
                                status: true
                            });
                        } else if (!dataDomain.disabledDomainNotification[message.domain]) {
                            /* El sitio no esta bloqueado */
                            return callback({
                                status: true
                            });
                        } else {
                            /* El sitio esta bloqueado */
                            return callback({
                                status: false
                            });
                        }
                    });
                } else {
                    /* No me pidio solo un sitio, respondo que las globales estan activadas */
                    return callback({
                        status: true
                    });
                }
            } else {
                /* Estan desactivadas las notificaciones */
                return callback({
                    status: false
                });
            }
        });
    },

    /**
     * Obtener el estado de las notificaciones de sitios inseguros
     * @param {Object}              message                 El mensaje que contiene el dominio (si se requiere)
     * @param {getNotificationCallback}     callback                Callback de respuesta
     */

    /**
     * @callback getNotificationCallback
     * @param {Boolean}             true - notificaciones activadas / false - notificaciones desactivadas
     */
    getUpdateNotificationStatus: function (message, request, callback) {
        chrome.storage.sync.get('updateNotifications', function (data = {}) {
            if (typeof data.updateNotifications === "undefined") {
                return callback({
                    status: true
                });
            }

            return callback({
                status: data.updateNotifications
            });
        });
    },

    /**
     * Obtener el estado de las notificaciones de sitios inseguros
     * @param {Object}              message                 El mensaje que contiene el dominio (si se requiere)
     * @param {getNotificationCallback}     callback                Callback de respuesta
     */

    /**
     * @callback getNotificationCallback
     * @param {Boolean}             true - notificaciones activadas / false - notificaciones desactivadas
     */
    getUpdateNotificationStatusPopUp: function (message, request, callback) {
        chrome.storage.sync.get('popupUpdateNotifications', function (data = {}) {
            if (typeof data.popupUpdateNotifications === "undefined") {
                return callback({
                    status: true
                });
            }

            return callback({
                status: data.popupUpdateNotifications
            });
        });
    },

    /**
     * @description Obtener el listado de dominios con notificaciones desactivadas
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    getDisabledNotification: function (message, request, callback) {
        chrome.storage.sync.get('disabledDomainNotification', function (dataDomain = {}) {
            var domains = [];
            if (dataDomain.disabledDomainNotification) {
                for (var domain in dataDomain.disabledDomainNotification) {
                    domains.push(domain);
                }
            }
            return callback({
                domains: domains
            });
        });
    },

    /**
     * @description Obtiene el search provider que tiene configurado el usuario
     * @param {Any} message
     * @param {Object} request
     * @param {Function} callback - funcion para manejar la respuesta
     */
    getSearchProvider: function (message, request, callback) {
        app.getSearchProvider(function (response) {
            return callback(response);
        });
    },

    /**
     * @description Obtiene los search providers que estan configurados en el servidor
     * @param {Any} message
     * @param {Object} request
     * @param {Function} callback - funcion para manejar la respuesta
     */
    getSearchProviders: function (message, request, callback) {
        app.getSearchProviders(function (response) {
            return callback(response);
        });
    },

    /**
     * @description Setea el proveedor de busqueda seleccionado por el usuario
     * @param {Any} message
     * @param {Object} request
     * @param {Function} callback - funcion para manejar la respuesta
     */
    setSearchProvider: function (message, request, callback) {
        app.setSearchProvider(message.searchProvider);
    },

    /**
     * @description Habilitar el Adblocker Free Mode en la API.
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    enableAdblockerFreeMode: function (message, request, callback) {
        var update = function () {
            logger.debug('[messages.enableAdblockerFreeMode] Habilitando Adblocker Free Mode');
            webService.post('user/adblocker/free', {}, function () {
                logger.debug('[messages.enableAdblockerFreeMode] Adblocker Free Mode habilitado.');
                // Ejecuto la sincronizacion para que refresque el proveedor en memoria
                app.syncAccount();
            }, function () {
                logger.error('[messages.enableAdblockerFreeMode] Errro habilitando Adblocker Free Mode. Reintentando.');
                return setTimeout(update, 30000);
            });
        }

        update();
    },

    /**
     * @description Controla si puede mostrar la notificacion de que instale el Adblocker
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    canShowUpdateAlert: function (message, request, callback) {
        callback(showInstallAlert);
        showInstallAlert = false;
    },

    /**
     * @description Controlar si tiene un tipo de extension actualmente instalada
     * @param {Object} message - Informacion necesaria para hacer la consulta
     * @param {Object} request - 
     * @param {Function} callback - funcion para manejar la respuesta
     */
    checkExtensionInstalled: function (message, request, callback) {
        app.checkExtensionInstalled(message.extensionType, function (isInstalled) {
            return callback({
                installed: isInstalled
            });
        });
    }
};

var externalHandler = {
    getToken: function (message, request, callback) {
        logger.debug('[externalHandler.getToken] Llega mensaje. Envio respuesta');
        var session = webService.getSession();
        return callback({
            token: webService.getToken(),
            uid: session
                ? session.uid
                : null,
            installed: true
        });
    },
    isInstalled: function (message, request, callback) {
        logger.debug('[externalHandler.isInstalled] Llega mensaje. Envio respuesta');
        var session = webService.getSession();
        return callback({
            token: webService.getToken(),
            uid: session
                ? session.uid
                : null,
            installed: true
        });
    },
    logout: function (message, request, callback) {
        logger.debug('[externalHandler.logout] Realizando logout');
        app.logout(function (session) {
            logger.debug('[externalHandler.logout] Logout finalizado');
            return callback({});
        });
    },
    // Safebrowsing
    getSearchProvider: function (message, request, callback) {
        logger.debug('[externalHandler.getSearchProvider] Obteniendo search provider');
        app.getSearchProvider(function (response) {
            logger.debug('[externalHandler.getSearchProvider] Retornando search provider en uso');
            var res = {};
            if (response && response.searchProvider) {
                res.searchProvider = response.searchProvider;
            }

            return callback(res);
        });
    }
};

/* Escucha eventos internos de la extension */
chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (handler[message.action]) {
        handler[message.action](message, sender, callback);
        return true;
    }
});

/* Escucha eventos de otras extensiones */
chrome.runtime.onMessageExternal.addListener(function (message, request, callback) {
    var action = message.action || message.message;

    // Solo controla si esta definido el handler
    if (action && externalHandler[action]) {
        logger.debug('[messages.onMessageExternal] Llego un mensaje de otra extension: ' + request.id);

        /* Antes de responder, pide todas las extensiones de memoria / API */
        app.getExtensions(false, function (response) {
            if (!response || !response.extensions || !response.extensions.length) {
                logger.debug('[messages.onMessageExternal] No se pudo obtener el listado de extensiones para responder');
                return callback({});
            }

            /* Verifica si la extension que esta enviando el mensaje percenece a trustnav */
            var result = $.grep(response.extensions, function (extension) {
                return extension.extension_id === request.id;
            });

            /* Si no encontro resultados quiere decir que la extension no pertenece a trustnav */
            if (!result[0]) {
                logger.debug('[messages.onMessageExternal] La extension que envia el mensaje no pertenece a Trustnav');
                return callback({});
            }

            externalHandler[action](message, request, callback);
        });
    }

    return true;
});

/**
 * @description Aumenta el incremento de busquedas que hizo el usuario 
 * y setea el search provider recomendado en caso de que haya hecho mas las búsquedas necesarias
 */
var updateSearch = function () {
    var token = webService.getToken();
    if (!token) {
        return logger.debug('No se cuenta la búsqueda ya que todavía no está registrado el usuario');
    }

    /* Obtiene la cantidad de busquedas totales que hizo el usuario */
    chrome.storage.sync.get('amountSearchs', function (response) {
        var amount = 1;

        if (response && response.amountSearchs !== undefined) {
            amount = ++response.amountSearchs;
        }

        /* Guarda el incremento en las busquedas en el cache */
        chrome.storage.sync.set({
            amountSearchs: amount
        }, function () {
            /* Si busco la cantidad de veces requerida, setea el search provider que este como recomendado */
            var searchsToSwitch = localStorage.getItem('next_search_provider_amount');

            if (searchsToSwitch && amount == searchsToSwitch) {
                app.getSearchProviders(function (response) {
                    if (response && response.searchProviders) {
                        var id = localStorage.getItem('next_search_provider_id') || 1;

                        var sp = $.grep(response.searchProviders, function (searchProvider) {
                            return searchProvider.id == id;
                        });

                        if (sp[0]) {
                            app.setSearchProvider(sp[0], false, true);
                        }

                        localStorage.removeItem('next_search_provider_id');
                        localStorage.removeItem('next_search_provider_amount');
                    }
                });
            }
        });
    });
}

/**
 * @description Pide el rating de un dominio a la api y guarda la respuesta en memoria
 * @param {String} domain - dominio del cual consultar el rating 
 * @param {Function} callback - Funcion para manejar la respuesta
 */
var webServiceGetRating = function (domain, callback) {
    var url = 'rating?domain=' + encodeURI(domain);

    /* Consulta el cache de user rating del usuario */
    chrome.storage.sync.get('userRating', function (data = {}) {
        var domains = data.userRating;

        /** Si no tiene token, no pedir el rating */
        if (!webService.getToken()) {
            return callback(true);
        }

        /* Si no tiene cache, lo setea como objeto vacio para facilitar el uso */
        if (!domains) {
            domains = {};
        }

        /* Pide el rating a la api */
        webService.get(url, function (response) {
            /* Setea el rating del usuario en base al cache local */
            response.user = domains[domain];
            return callback(null, response);
        }, function (err) {
            return callback(err);
        });
    });
}

/**
 * @description Guarda el rating de un dominio en cache y el user rating en el storage de chrome
 * @param {Integer} tabId - Identificador del tab donde esta el usuario
 * @param {String} domain - dominio del cual guardar el rating
 * @param {Object} apiResponse - Informacion que dio la API del dominio
 * @param {Function} callback - Funcion para manejar la respuesta
 */
var saveDomainRating = function (tabId, domain, apiResponse, callback) {
    var expiration = (new Date().getTime()) + 86400400; // 24 horas

    /* Lo guarda en memoria */
    ratings[domain] = apiResponse;
    ratings[domain].expires = expiration;

    var clonedRating = $.extend(true, {}, ratings[domain]);
    tabStates[tabId].rating = clonedRating;

    /* Si no viene el voto del usuario no hay que hacer mas nada */
    if (apiResponse.user === null || apiResponse.user === undefined) {
        return callback(clonedRating);
    }

    /* Si viene user rating lo guarda en cache sync */
    chrome.storage.sync.get('userRating', function (data = {}) {
        var domains = data.userRating;

        /* Si no tiene cache, lo setea como objeto vacio para facilitar el uso */
        if (!domains) {
            domains = {};
        }

        domains[domain] = apiResponse.user;

        chrome.storage.sync.set({
            userRating: domains
        }, function () {
            return callback(clonedRating);
        });
    });
}