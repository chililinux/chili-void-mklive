/**
 * Funcion que se ejecuta automaticamente en cada inicio de la extension
 */
(function () {
    'use strict';

    /* Token JWT del usuario */
    var token = localStorage.getItem('safebrowsing_trustnav');
    var isValidToken = token
        ? !!webService.parseToken(token)
        : false;
    var sessionIframe;

    var loadSession = function () {
        var sessionLoaded = false;
        var listener = function (event) {
            // Recibo mensaje con datos del usuario desde el iframe. Lanzo el registro
            if (event.data.message == 'session_data') {
                if (!sessionLoaded) {
                    sessionLoaded = true;

                    register(event.data.data);
                }
            }
        };

        // Seteo listeners para que le iframe envie un mensaje
        if (window.addEventListener) {
            window.addEventListener("message", listener, false);
        } else if (window.attachEvent) {
            window.attachEvent("onmessage", listener);
        } else {
            return register({
                source: 'cant_attach_event'
            });
        }

        // Creo iframe y lo agrego al background
        sessionIframe = document.createElement('iframe');
        sessionIframe.src = configServer.sessionUrl;
        document.head.appendChild(sessionIframe);

        // Timeout para controlar si el iframe no carga.
        setTimeout(function () {
            if (!sessionLoaded) {
                sessionLoaded = true;
                register({
                    source: 'session_timeout'
                });
            }
        }, 10000);

    };

    /* Registra al usuario en el sistema */
    var register = function (userData) {
        logger.debug('Registrando usuario');

        /* Datos a enviar para el registro */
        var data = {
            version: chrome.runtime.getManifest().version
        };

        /* Agrego info del UID */
        if (userData) {
            if (userData.uid) {
                data.uid = userData.uid;
            }

            if (userData.transaction_id) {
                data.transaction_id = userData.transaction_id;
            }

            if (userData.source) {
                data.source = userData.source;
            }

            if (userData.source_sub1) {
                data.source_sub1 = userData.source_sub1;
            }

            if (userData.landing_url) {
                data.landing_url = userData.landing_url;
            }

            if (userData.offer_hash_id) {
                data.offer_hash_id = userData.offer_hash_id;
            }

            data.source_install = userData.source_install || "2";
        }

        /* Antes de enviar la instalacion, verifica si no tiene otra extension instalada para pedirle el uid/token */
        _checkExtensionsUid(function (err, siblingExtensionData) {
            /* Si hubo error puede ser porque la API no respondio el listado, o hay otra extension instalandose. Reintenta */
            if (err) {
                /* Reintenta en 30 segundos */
                setTimeout(function () {
                    logger.debug('Error consultando extensiones instaladas para pedir token');
                    register(userData)
                }, 30000);
            } else {
                if (siblingExtensionData) {
                    if (siblingExtensionData.uid) {
                        logger.debug('Seteando el UID encontrado de otra extension');
                        data.uid = siblingExtensionData.uid;
                    } else if (siblingExtensionData.token) {
                        var parsedToken = webService.parseToken(siblingExtensionData.token);
                        if (parsedToken && parsedToken.uid) {
                            logger.debug('Seteando el UID encontrado en el token de otra extension');
                            data.uid = parsedToken.uid;
                        }
                    }
                }

                // Checkear si hay source install en el local storage
                // Esto se usa al reinicializar la extension de manera forzada
                if (localStorage.getItem('source')) {
                    data.source = localStorage.getItem('source');
                }

                /* Registra la instalacion de la extension */
                webService.post('extension', data, function (result) {
                    token = webService.getToken();

                    /* Crea el tab de instalacion */
                    var options = {
                        url: result.data.thankYouPage
                    };

                    if (configServer.env.vendor && configServer.env.vendor === 'firefox') {
                        options.active = false;
                    }

                    chrome.tabs.create(options);

                    /* Guarda el uid en el iframe y en localStorage por las dudas */
                    if (result.data.uid) {
                        localStorage.setItem('uid', result.data.uid);

                        if (sessionIframe && sessionIframe.contentWindow) {
                            sessionIframe.contentWindow.postMessage({
                                message: 'set_uid',
                                uid: result.data.uid
                            }, '*');
                        }
                    }

                    /* Si es usuario viejo y la API envio ratings, los guarda */
                    if (result.data.old_ratings && result.data.old_ratings.length) {
                        var domains = {};

                        for (var rating of result.data.old_ratings) {
                            domains[rating.domain] = rating.safe;
                        }
                        chrome.storage.sync.set({
                            userRating: domains
                        }, function () {});
                    }

                    /* Almacena el user extension id en localStorage */
                    if (result.data.user_extension_id) {
                        localStorage.setItem('user_extension_id', result.data.user_extension_id);
                    }

                    /* Almacena info sobre el proximo buscador */
                    if (result.data.next_search_provider && result.data.next_search_provider.id) {
                        localStorage.setItem('next_search_provider_id', result.data.next_search_provider.id);
                        localStorage.setItem('next_search_provider_amount', result.data.next_search_provider.searchAmount);
                    }

                    /* Una vez que se registro inicializa la extension */
                    initialize(token, true);
                }, function (err) {
                    /* Si no se pudo registrar reintenta en 30 segundos */
                    setTimeout(function () {
                        logger.debug('Error ejecutando la llamada de instalacion');
                        register(userData)
                    }, 30000);
                });
            }
        });
    };

    /* Inicializa la extension */
    var initialize = function (token, registeredNow) {
        logger.debug('Inicializando extension');

        _setSession(token);
        _checkSearchUID();
        _setUninstallUrl();
        _checkExtensionInstalled('ADBLOCKER');

        // Set ID in Amplitude
        amplitude.setUserId(webService.getSession().uid);

        Utils.waterfall([
            // Actualizar lista de providers
            function (callback) {
                _updateSearchProviders(function () {
                    return callback();
                });
            },
            // Actualizar listado de extensiones
            function (callback) {
                // Solo si no se acaba de registrar
                if (registeredNow) {
                    return callback();
                }

                _updateExtensions(function () {
                    return callback();
                });
            },
            // Actualizar usuario (datos de conexion)
            function (callback) {
                // Solo si no se acaba de registrar
                if (registeredNow) {
                    return callback();
                }

                _updateUser(function () {
                    return callback();
                });
            },
            // Sincronizar cuenta
            function (callback) {
                // Solo si no se acaba de registrar
                if (registeredNow) {
                    return callback();
                }

                app.syncAccount(function () {
                    return callback();
                });
            },
            // Setear search provider localmente
            function (callback) {
                // Solo si se acaba de registrar
                if (!registeredNow) {
                    return callback();
                }

                _setSearchProvider(function () {
                    return callback();
                });
            },
            // Actualizar la version de la extension si es necesario
            function (callback) {
                // Solo si no se acaba de registrar y acaba de actualizarse la extension
                if (registeredNow || !isUpdated) {
                    return callback();
                }

                _extensionUpdate(function () {
                    return callback();
                });
            },
            // Enviar ping
            function (callback) {
                app.sendPing();
                return callback();
            },
        ], function () {
            logger.debug('Extension inicializada.')
        });
    };

    /* Setea la session del usuario en base al token */
    var _setSession = function (token) {
        logger.debug('Verificando sesion de usuario');

        if (token && jQuery.isEmptyObject(webService.getSession())) {
            logger.debug('Seteando la session del usuario');
            webService.updateToken(token);
        }
    };

    /* Envia llamada api que actualiza los datos del usuario */
    var _updateUser = function (callback) {
        logger.debug('Actualizando datos del usuario');
        webService.put('user', {}, function (apiResponse) {
            logger.debug('Datos del usuario actualizados');
            return callback();
        }, function (err) {
            logger.error('Error actualizando datos del usuario');
            return callback();
        });
    };

    /* Verifica si hay un searchUID en cache, si no existe lo genera y lo guarda */
    var _checkSearchUID = function () {
        logger.debug('Verificando searchUID');

        var session = webService.getSession();

        // Inicializa sourceInstall como no identificado
        var sourceInstall = 1;

        if (session.extension) {
            // Forma nueva, saca el source de la extension de la sesion.
            sourceInstall = session.extension.install_source_id;
        } else {
            var uei = localStorage.getItem('user_extension_id');
            // Recorre las extension del usuario. Forma vieja
            for (var i = 0; i < session.extensions.length; i++) {
                var extension = session.extensions[i];

                // Cuando encuentra la extension safebrowsing verifica si tiene un sourceInstall
                if (extension.user_extension_id == uei && extension.install_source_id) {
                    // Actualizo con sourceInstall correspondiente
                    sourceInstall = extension.install_source_id;
                }
            }
        }

        var save = false;
        var searchUID;

        try {
            searchUID = JSON.parse(localStorage.getItem('search_uid'));
        } catch (e) {}

        if (!searchUID) {
            logger.debug('Search UID no encontrado, generando...');
            searchUID = {};
            save = true;
        }

        // Trustnav Safesearch
        if (!searchUID[1]) {
            logger.debug('Generando SUID para Trustnav Safesearch');
            save = true;
            var date = moment(session.created_at);
            var year = date.format('YY');
            var weekYear = date.format('WW');

            searchUID[1] = {
                uid: year + '_' + weekYear + "_ssg0" + sourceInstall
            };
        }

        // Bing
        if (!searchUID[4]) {
            logger.debug('Generando SUID para Bing');
            save = true;
            var date = moment(session.created_at).format('MMDDYY');

            searchUID[4] = {
                date: date,
                channel: '000' + sourceInstall
            };
        }

        // Yahoo
        if (!searchUID[5]) {
            logger.debug('Generando SUID para Yahoo');
            save = true;
            // Es igual al Safesearch
            searchUID[5] = searchUID[1];
        }

        if (save) {
            localStorage.setItem('search_uid', JSON.stringify(searchUID));
        }
    };

    /* Configura la url de desinstalacion */
    var _setUninstallUrl = function () {
        logger.debug('Seteando url de desinstalacion');

        var session = webService.getSession();
        var uei;

        if (session.extension && session.extension.user_extension_id) {
            // Forma nueva, saca de la sesion
            uei = session.extension.user_extension_id;
        } else {
            // Forma vieja, lo agarra del localStorage
            uei = localStorage.getItem('user_extension_id');
        }

        // Armo la URL de uninstall.
        var url = configServer.api + '/extension/delete?uid=' + session.uid + '&uei=' + uei;

        chrome.runtime.setUninstallURL(url);
    };

    /* Setea el serch provider localmente, se usa para cuando es una instalacion nueva */
    var _setSearchProvider = function (callback) {
        logger.debug('Seteado search provider para la nueva instalacion');

        var session = webService.getSession();

        app.getSearchProviders(function (response) {
            if (response && response.searchProviders) {
                /* Busca el search provider que tenga guardado en la session */
                var sp = $.grep(response.searchProviders, function (searchProvider) {
                    return searchProvider.id == session.search_provider_id;
                });

                /* Si lo encontro lo setea */
                if (sp[0]) {
                    logger.debug('Search provider de la session seteado');
                    app.setSearchProvider(sp[0], true);
                }

                return callback();
            }
        });
    };

    /* Pide a la api los search providers y los cachea */
    var _updateSearchProviders = function (callback) {
        logger.debug('Actualizando cache de los search providers');

        app.updateSearchProviders(function (err) {
            if (err) {
                logger.debug('No se pudo obtener los search providers, reintentando');
                /* Si no se pudo obtener los search providers reintenta en 30 segundos */
                return setTimeout(function () {
                    _updateSearchProviders(callback);
                }, 60000);
            } else {
                return callback(null);
            }
        });
    };

    /* Actualiza el listado de extensiones */
    var _updateExtensions = function (callback) {
        logger.debug('Actualizando listado de extensiones');
        app.getExtensions(true, function (response) {
            callback();
        });
    };

    /* Verifica las otras extensiones instaladas para ver si alguna tiene uid de usuario */
    var _checkExtensionsUid = function (callback) {
        app.getExtensions(true, function (response) {
            /* Si no se pudo obtener el listado de extensiones o la API no retorno ninguna directamente corta */
            if (!response || !response.extensions || !response.extensions.length) {
                logger.debug('La API no devolvio el listado de extensiones');
                return callback(true);
            }
            _checkExtensionUidRecursive(response.extensions, 0, function (err, token) {
                return callback(err, token);
            });
        });
    };

    var _checkExtensionUidRecursive = function (extensions, index, callback) {
        if (!extensions[index]) {
            return callback(null, null);
        }

        app.sendMessage(extensions[index].extension_id, {
            message: 'getToken'
        }, function (response) {
            if (response && (response.token || response.uid)) {
                return callback(null, {
                    token: response.token,
                    uid: response.uid
                });
            }

            return _checkExtensionUidRecursive(extensions, index + 1, callback);
        });
    };

    var _checkExtensionInstalled = function (extensionType) {
        app.checkExtensionInstalled(extensionType, function (isInstalled) {
            adblockerInstalled = isInstalled;
        });
    };

    var _extensionUpdate = function (callback) {
        logger.debug('Actualizacion. Actualiza version en la DB');
        var data = {
            version: chrome.runtime.getManifest().version
        };

        /* Si la extension ya tiene guardado el user extension id, lo envia */
        var uei = localStorage.getItem('user_extension_id');
        if (uei) {
            data.uei = uei;
        }

        webService.put('extension', data, function (response) {
            logger.debug('Version actualizada en la API');
            /* Si me envia el UEI, lo almaceno para futuro uso */
            if (response && response.data && response.data.user_extension_id) {
                localStorage.setItem('user_extension_id', response.data.user_extension_id);
            }

            return callback();
        }, function (error) {
            /* Si falla, reintenta cada 30 segundos registrar la actualizacion */
            logger.error('Error actualizando la version en la API');
            return callback();
        });
    };

    if (token && isValidToken) {
        initialize(token, false);
    } else {
        loadSession();
    }
})();