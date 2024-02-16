window.addEventListener("message", function(event) {
    var data = event.data;

    if (data.type !== 'search') {
        return;
    }

    // Aca lo mando directo ya que en el mensaje ya esta parseado
    chrome.runtime.sendMessage({ action: 'newSearch', event_type: 'ENGINE_SEARCH', query: decodeURIComponent(data.query) }, function (result) {
        //
    });
}, false);