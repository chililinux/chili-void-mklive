var findGetParameter = function (parameterName) {
    var result = null,
        tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = tmp[1];
    });
    return result;
};

if (findGetParameter("q")) {
    var query = decodeURIComponent(findGetParameter("q").replace(/\+/gm, "%20"));
    var params = {
        action: 'newSearch',
        event_type: 'ENGINE_SEARCH',
        query: query
    };

    chrome.runtime.sendMessage(params, function (result) {
        //
    });
}