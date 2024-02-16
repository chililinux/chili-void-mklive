$(document).ready(function () {
    var closeIframe = function () {
        parent.postMessage({
            message: 'trustnav_close_safebrowsing_iframe'
        }, '*');
    }

    $("#disableNotifications").on('click', function () {
        cr.sendMessage({
            'action': 'getWindowUrl'
        }, function (href) {
            cr.sendMessage({
                'action': 'setNotificationStatus',
                'domains': [parseDomain(href)],
                'status': true
            }, function () {});
            closeIframe();
        });

    });
    // Click al boton para desactivar notifiaciones en el total
    $("#disableAllNotifications").on('click', function () {
        cr.sendMessage({
            'action': 'setNotificationStatus',
            'status': true
        }, function () {});
        closeIframe();
    });

    $('[js-close]').click(closeIframe);

    var cr = chrome.runtime;
});