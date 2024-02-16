const getRedirectUriFromYahoo = (url) => {
    let subStr = url.substring(
        url.lastIndexOf("/RU=") + 4, 
        url.lastIndexOf("/RK=")
    );

    if (subStr == "htt") {
        return (url);
    }

    return decodeURIComponent(subStr);
}

const getSearchEngineResultUrls = (elem, se) => {
    let currentUrl = window.location.href;
    let elemSelector = document.querySelectorAll(elem);
    let urls = [];
    let searchEngine = null;

    if (se) {
        searchEngine = se;
    }

    for (let i = 0; i < elemSelector.length; i++) {
        if (se == 'yahoo') {
            urls.push(getRedirectUriFromYahoo(elemSelector[i].href));
        } else {
            let domain = getDomainName(elemSelector[i].href);
            let arr = ["https://www.google.com"];
            if (arr.indexOf(domain) === -1) {
                urls.push(elemSelector[i].href);
            }
        }
    }

    return {
        currentUrl: currentUrl,
        searchEngine: searchEngine,
        urls: urls
    }
};

const queryContainsTorrentWords = (param) => {
    let torrentWords = ["torrent", "torrents", "torent", "torents", "torrrent", "torrrents", "torrant", "torrants", "torant", "torants", "торрент", "torrente", "急流", "strom", "激流", "përrua", "паток", "bujica", "порой", "stortvloed", "ryöppy", "χείμαρος", "özön", "straumur", "straume", "srautas", "potok", "поток", "торент", "bystrina", "потік", "מאַבל", "potik", "potok", "cheímaros"];
    let currentUrl = window.location.href;
    let searchQuery = getParameterByName(currentUrl, param);
    let hasTorrentWords = false;

    if (searchQuery) {
        hasTorrentWords = torrentWords.some(word => searchQuery.toLowerCase().includes(word.toLowerCase()));
    }

    return {
        searchQuery: searchQuery,
        hasTorrentWords: hasTorrentWords
    }
};

const searchEngineData = (searchEngine) => {
    let searchEngineData = null;
    let hasTorrentWords = false;
    switch (searchEngine) {
        case 'google':
            searchEngineData = getSearchEngineResultUrls('.g div div a', 'google');
            hasTorrentWords = queryContainsTorrentWords('q');
        break;
        case 'bing':
            searchEngineData = getSearchEngineResultUrls('.b_algo h2 a', 'bing');
            hasTorrentWords = queryContainsTorrentWords('q');
        break;
        case 'yahoo':
            searchEngineData = getSearchEngineResultUrls('.searchCenterMiddle>li>div.algo>div.compTitle>h3.title>a', 'yahoo');
            hasTorrentWords = queryContainsTorrentWords('p');
        break;
        case 'yandex':
            searchEngineData = getSearchEngineResultUrls('.organic__title-wrapper>a', 'yandex');
            hasTorrentWords = queryContainsTorrentWords('text');
        break;
        default: // any other webpages
            searchEngineData = {
                currentUrl: window.location.href,
                hasTorrentWords: false,
                searchEngine: null,
                searchQuery: null,
                urls: [
                    window.location.href
                ]
            };
    }

    return {
        ...searchEngineData,
        ...hasTorrentWords
    }
};

// On window loaded
window.addEventListener('DOMContentLoaded', (ev) => {

    // Send listerner on page loaded
    chrome.runtime.sendMessage({
        what: "onPageLoaded"
    });

    // inject element to website
    if (location.host === "media.adaware.com") {
        let el = document.createElement("div");
        el.setAttribute("id", "myTorrentScannerExtension");
        document.body.appendChild(el);
    }

    // Need to read the DOM and get torrent files and magnet links from the page
    // If it's an search engine (google, yahoo, bing, etc), get all links from the search engine and send it to background to fetch each url to see if there are any torrent/magnet url.
    let currentUrl = window.location.origin;
    let isSearchEngine = getHostNameFromSearchEngine(currentUrl);
    let data = searchEngineData(isSearchEngine);

    

    chrome.runtime.sendMessage({
        what: 'pageData',
        data
    }, (data) => {
        
        if (data?.hasTorrentWords) {
            setTimeout(() => {
                let popup = document.getElementById("torrent-scanner-popup");
                popup.style.display = "block";

                setTimeout(() => {
                    let rows = popup.shadowRoot.querySelectorAll(".t-row");

                    if (rows.length < 1) {
                        let loading = popup.shadowRoot.querySelector('.spinner');
                        let tooltip = popup.shadowRoot.querySelector('.tooltip');
                        let content = popup.shadowRoot.querySelector('#table-message');
                        loading.remove();
                        content.style.display = 'block';
                        tooltip.style.display = 'block';
                    }
                }, 3000);
            }, 3000);
        }
    });
});
