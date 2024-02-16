function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Enviar sesion a la pagina
chrome.runtime.sendMessage({
    action: 'getSession'
}, function (response) {
    window.postMessage({
        type: 'session',
        session: response.session,
        token: response.token
    }, '*');
});

var listener = function (message) {
    if (message.data.type === 'login') {
        chrome.runtime.sendMessage({
            action: 'login',
            hash: message.data.hash
        }, function () {});
    }

    if (message.data.type === 'refresh_session') {
        chrome.runtime.sendMessage({
            action: 'refreshSession',
        }, function () {});
    }

    if (message.data.type === 'logout_user') {
        chrome.runtime.sendMessage({
            action: 'logout',
        }, function () {});
    }

    if (message.data.type === 'enable_adblocker_free_mode') {
        chrome.runtime.sendMessage({
            action: 'enableAdblockerFreeMode',
        }, function () {});
    }
};

// Seteo listeners para que le iframe envie un mensaje
if (window.addEventListener) {
    window.addEventListener("message", listener, false);
} else if (window.attachEvent) {
    window.attachEvent("onmessage", listener);
}