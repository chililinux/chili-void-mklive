'use strict';

var webService = {
    apiUrl: configServer.api + "/",
    token: null,
    session: null,
    post: function (path, body, headers, callback, errorCallback) {
        this.request(path, 'POST', body, headers, callback, errorCallback);
    },
    get: function (path, headers, callback, errorCallback) {
        this.request(path, 'GET', null, headers, callback, errorCallback);
    },
    put: function (path, body, headers, callback, errorCallback) {
        this.request(path, 'PUT', body, headers, callback, errorCallback);
    },
    delete: function (path, body, headers, callback, errorCallback) {
        this.request(path, 'DELETE', body, headers, callback, errorCallback);
    },
    request: function (path, method, body, headers, callback, errorCallback) {
        /* Si headers es una funcion, es porque no lo envio y es el callback) */
        if (typeof headers === 'function') {
            // Corro los parametros
            errorCallback = callback;
            callback = headers;
            headers = null;
        }

        var self = this;
        var options = {
            url: this.apiUrl + path,
            method: method,
            headers: {
                'Extension': configServer.extensionKey,
                'X-Extension-Id': chrome.runtime.id,
                'X-Extension-Version': chrome.runtime.getManifest().version
            },
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            traditional: true
        };

        if (body) {
            options.data = JSON.stringify(body);
        }

        var uei = localStorage.getItem('user_extension_id');
        if (uei) {
            options.headers['X-User-Extension-Id'] = uei;
        }

        if (this.token) {
            options.headers.Authorization = this.token;
        }

        if (headers) {
            options.headers = $.extend(options.headers, headers);
        }

        $.ajax(options).done(function (data, status, request) {
            if (data) {
                // Si envia un token por response header, lo parseo y actualizo.
                var token = request.getResponseHeader('Authorization');
                if (token) {
                    self.updateToken(token);
                }

                return callback(data);
            } else {
                return errorCallback({
                    message: 'Empty response',
                    status: status
                });
            }
        }).fail(function (err) {
            if (err && err.responseJSON) {
                // OJO! Fuerza reinicializacion de toda la extension, incluido un nuevo token.
                if (err.responseJSON.message === 'FORCE_USER_REGENERATE') {
                    return app.forceInitialize();
                }

                return errorCallback(err.responseJSON);
            }

            return errorCallback({
                status: err.status || 'unknown',
                responseText: err.responseText || 'unknown',
                toString: err.toString ? err.toString() : 'none'
            });
        });
    },
    updateToken: function (newToken) {
        var parsedSession = this.parseToken(newToken);

        // Si el token cambio y se pudo parsear, lo actualiza en memoria y en 
        if (parsedSession && newToken !== this.token) {
            logger.debug('[webservice.updateToken] Actualizando session.');
            this.setToken(newToken);
            this.setSession(parsedSession);
        }
    },
    parseToken: function(token) {
        try {
            var parsedSession = jwt_decode(token);
            if (parsedSession && parsedSession.id) {
                return parsedSession;
            }
        } catch (err) {
            logger.crit('[webService.parseToken] Unable to parse JWT Token', {
                code: err.code,
                message: err.message,
                token: token
            });
        }
        return null;
    },
    getToken: function () {
        return this.token;
    },
    setToken: function (token) {
        this.token = token;
        localStorage.setItem('safebrowsing_trustnav', token);
    },
    getSession: function () {
        return this.session;
    },
    setSession: function (session) {
        this.session = session;
    }
}