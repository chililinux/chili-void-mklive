var Communication = {
    broadcast: function (message, callback) {
        var self = this;
        app.getExtensions(null, function (response) {
            if (response && response.extensions && response.extensions.length) {
                var extensions = response.extensions;
                var total = extensions.length;
                var totalReady = 0;

                // Control de que se envio a todas las extensiones
                var cb = function () {
                    totalReady++;
                    if (total === totalReady) {
                        logger.debug('Broadcast terminado');
                        return callback();
                    }
                };

                // Enviar mensaje a todas las extensiones
                for (var i = 0; i < extensions.length; i++) {
                    var extension = extensions[i];
                    self.sendMessage(extension.extension_id, message, cb);
                }
            }
        });
    },
    sendMessage: function (extensionId, message, callback) {
        if (!extensionId) {
            return callback(null);
        }

        logger.debug('[communication.sendMessage] Enviando mensaje a: ' + extensionId);
        chrome.runtime.sendMessage(extensionId, message, function (response) {
            if (response && !jQuery.isEmptyObject(response)) {
                logger.debug('[communication.sendMessage] Llego respuesta extension: ' + extensionId);
                return callback(response);
            }

            return callback(null);
        });
    },
};