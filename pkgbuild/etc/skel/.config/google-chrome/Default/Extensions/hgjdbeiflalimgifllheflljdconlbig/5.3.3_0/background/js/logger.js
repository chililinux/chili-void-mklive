'use strict';

var logger = {
    log: function(level, message, meta) {
        if (this._isEnabled(level)) {
            console.log('[' + moment().format('HH:mm:ss') +'] ' + level + ': ' + message);

            if (level === 'crit') {
                var body = {
                    message: message,
                    meta: meta || {}
                };
                webService.post('extension/bug/', body, function() {}, function(err) {
                    console.log('Error reporting bug', err);
                });
            }
        }
    },
    _isEnabled(type) {
        if (configServer.logger.levels.indexOf(type) >= configServer.logger.levels.indexOf(configServer.logger.logLevel)) {
            return true;
        }
    
        return false;
    }
};

configServer.logger.levels.forEach((level) => {
    logger[level] = (msg, meta) => {
        return logger.log(level, msg, meta)
    }
});