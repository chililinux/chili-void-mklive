document.documentElement.setAttribute('trustnav-installed', true);

var findGetParameter = function (parameterName) {
    var result = null,
        tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = tmp[1];
    });
    return result;
};

if (findGetParameter('src') === 'ext') {
    var action = findGetParameter('action') || 'search';
    var searchQuery = findGetParameter('q');

    if (action === 'search') {
        chrome.runtime.sendMessage({
            action: 'getSearchProvider'
        }, function (response) {
            var uid = response.uid || {};

            // Evento de busqueda
            var query = decodeURIComponent(searchQuery.replace(/\+/gm, "%20"));
            chrome.runtime.sendMessage({
                action: 'newSearch',
                event_type: 'DIRECT_SEARCH',
                query: query
            }, function (result) {});

            if (response.searchProvider.id === 1 || response.searchProvider.id === 8) {
                // Safesearch y Trustnav.com
                var _uid = uid[1] || {};
                var _default = '00_00_ssg01';

                // Reemplazo valores en la URL
                var suid = _uid.uid || _default;
                var url = response.searchProvider.search_url;
                var searchUrl = url.replace(/{param}/gi, searchQuery);
                searchUrl = searchUrl.replace(/{suid}/gi, suid);

                window.location.href = searchUrl;
            } else if (response.searchProvider.id === 4) {
                // Bing
                var _uid = uid[4] || {};

                // Reemplazo valores en la URL
                var date = _uid.date || '010118';
                var channel = _uid.channel || '0001';
                var url = response.searchProvider.search_url;
                var searchUrl = url.replace(/{param}/gi, searchQuery);
                searchUrl = searchUrl.replace(/{date}/gi, date);
                searchUrl = searchUrl.replace(/{channel}/gi, channel);

                window.location.href = searchUrl;
            } else if (response.searchProvider.id === 5) {
                // Yahoo
                var _uid = uid[5] || {};
                var _default = '00_00_ssg01';

                // Inicializo SDK y redirijo.
                var suid = _uid.uid || _default;
                var clientId = 'gsp_trustnav_' + suid;
                // Send message to frontend to perform search.
                // Since Chrome 73 we cannot initialize SDK here because of CORS Policy.
                // see @https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
                window.postMessage({
                    type: 'search',
                    data: {
                        clientId: clientId,
                        query: searchQuery 
                    }
                }, '*');
            } else {
                // All
                // Reemplazo valores en la URL
                var url = response.searchProvider.search_url;
                var searchUrl = url.replace(/{param}/gi, searchQuery);
                window.location.href = searchUrl;
            }
        });
    }
}