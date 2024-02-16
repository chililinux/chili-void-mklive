'use strict';

var second = 1000;
var minute = 60 * second;
var hour = 60 * minute;

/**
 * Funcion que se ejecuta cada 10 minutos para eliminar los dominios que expiraron
 */
setInterval(function () {
	logger.debug('Eliminando dominios expirados del cache');

	var now = new Date().getTime();

	for (var domain in ratings) {
		if (ratings[domain].expires <= now) {
			delete ratings[domain];
		}
	}
}, 10 * minute);

/**
 * Funcion que se ejecuta cada 24 horas para actualizar los search providers
 */
setInterval(function () {
	logger.debug('Actualizando cache de los search providers');

	app.updateSearchProviders(function(err) {
		if (err) {
			logger.warn('No se pudo actualizar el cache de los search providers');
			return null;
		}
	});
}, 24 * hour);

/**
 * Funcion que se ejecuta cada 24 horas para actualizar las extensiones
 */
setInterval(function () {
	logger.debug('Actualizando el listado de extensiones');

	app.getExtensions(true, function (response) {
		logger.debug('Listado de extensiones actualizado.');
	});
}, 24 * hour);

/**
 * Funcion que se ejecuta cada 1 minuto para fijarse si el adblock esta instalado
 */
setInterval(function () {
	logger.debug('Verificando si el adblock esta instalado');
	app.checkExtensionInstalled('ADBLOCKER', function (isInstalled) {
		adblockerInstalled = isInstalled;
	});
}, 1 * minute);

/**
 * Funcion que se ejecuta cada 24 horas para actualizar los datos de conexion del usuario
 */
setInterval(function () {
	logger.debug('Actualizando datos del usuario');
	webService.put('user', {}, function (apiResponse) {
		logger.debug('Datos del usuario actualizados');
	}, function (err) {
		logger.error('Error actualizando datos del usuario');
	});
}, 24 * hour);

/**
 * Funcion que sincroniza la cuenta cada 12 horas.
 */
setInterval(function () {
	app.syncAccount();
}, 12 * hour);

/**
 * Funcion que se ejecuta cada 2 horas para enviar el evento ping sin si aun no se a enviado
 */
setInterval(function () {
	logger.debug('Vericando evento ping');
	app.sendPing();
}, 2 * hour);