chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'scrapeDom') {
        
        let arr = request.data || [];
        let arr2 = [];
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(request.data.html, 'text/html');
        let links = xmlDoc.getElementsByTagName('a');
        let urlOrigin = getDomainName(request.data.url);
        let count = 0;

        for (let j = 0; j < links.length; j++) {
            if (links[j].href.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) !== null) {
                if (links[j].href.split('&').length >= 2) {
                    arr2.push(links[j].href);
                    count++;
                }
            }

            if (links[j].href.match(/\.(torrent)$/) !== null) {
                if (links[j].href.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) === null) {
                    let torrentUri = null;

                    // double check torrent file uri origin is the correct domain
                    torrentUri = urlOrigin + (links[j].href).replace(getDomainName(links[j].href), '');

                    arr2.push(torrentUri);
                    count++;
                }
            }

            if (count === 30) { break; }
        }

        arr.torrentLinks = arr2;
        delete arr.html;

        sendResponse(arr);
    }

    // return true, this will keep the message channell open to the other end until sendResponse is called.
    return true;
});