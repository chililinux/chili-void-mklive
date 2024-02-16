(function () {
    var injectIframeDynamic = function (config) {
        var iFrame = document.createElement("iframe");
        iFrame.style.width = config.width;
        iFrame.style.height = config.height;
        iFrame.style.position = 'fixed';
        iFrame.style.top = '16px';
        iFrame.style.right = '16px';
        iFrame.style.zIndex = '9999999999';
        iFrame.style.borderRadius = '8px';
        iFrame.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.3)';
        iFrame.style.backgroundColor = '#ffffff';
        iFrame.style.border = 'solid 1px #d7d7d7';
        iFrame.src = chrome.extension.getURL(config.path);
        iFrame.id = 'trustnav_safebrowsing_iframe';

        document.body.insertBefore(iFrame, document.body.firstChild);
    };

    window.addEventListener("message", function (event) {
        if (event && event.data && event.data.message) {
            if (event.data.message === 'trustnav_close_safebrowsing_iframe') {
                closeTrustnavIframe(event.data.toClose);
            }
        }
    }, false);

    var closeTrustnavIframe = function () {
        var element = $('#trustnav_safebrowsing_iframe');
        if ($(element).length != 0) {
            $(element).remove();
        }
    };


    $(document).ready(function () {
        chrome.runtime.sendMessage({
            action: 'getRating'
        }, function (response) {
            /* Si se recibio rating */
            if (response && response.rating) {
                var average = response.rating.average;
                var userRating = response.rating.user;
                /* Si el promedio merece mostrar rating */
                if (average !== null && average !== undefined && average <= 40 && userRating !== 1) {
                    /* Obtengo el estado de las notificaciones */
                    chrome.runtime.sendMessage({
                        action: 'getNotificationStatus',
                        domain: parseDomain(window.location.href)
                    }, function (notification) {
                        /* Si tengo que mostrar la notificacion */
                        if (notification.status) {
                            injectIframeDynamic({
                                path: '../../views/notifications/unsafe_site/index.html',
                                width: '665px',
                                height: '265px'
                            });
                        }
                    })
                }
            }
        });
    });
}());