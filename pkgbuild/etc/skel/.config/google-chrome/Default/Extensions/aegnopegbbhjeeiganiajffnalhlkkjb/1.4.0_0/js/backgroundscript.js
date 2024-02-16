let browserEnvironmentData = new systemUtil.browserEnvironmentData();
let extensionURL = browserEnvironmentData.BrowserFamily == "Firefox" ? "moz-extension://" + (chrome.runtime.id).replace(/[{()}]/g, '') : "chrome-extension://" + chrome.runtime.id;

const getTorrentData = (data) => {
    // 
    return new Promise((resolve) => {
        let torrent = data || {};
        let T_obj = T;
        let M_obj = M;
        // let newResult = [];

        
        let torrentLinks = torrent.torrentLinks;

        if (torrentLinks.length > 0) {
            let torrentData = Promise.all(torrentLinks.map(url => {
                return new Promise((resolve) => {
                    if ((url).match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) !== null) {
                        // 
                        let magnet = M_obj.get_magnet_uri(url);
                        resolve(magnet);
                    }

                    if ((url).match(/\.(torrent)$/) !== null && new URL(url).host !== '') {
                        // 
                        fetch(url)
                        .then(response=>response.blob())
                        .then((r) => {
                            T_obj.get_torrent_info(r, (data) => {
                                resolve(data);
                            });
                        })
                        .catch((error) => {
                            
                        });
                    }
                });
                
            }));

            torrentData.then((data) => {
                torrent.torrentData = data;
                // newResult.push(torrent);
                resolve(
                    torrent
                );
            });
        }
        
    });
};

const webscraper = (data) => {
    let searchQuery = data.searchQuery;
    let hasTorrentWords = data.hasTorrentWords;
    let urls = data.urls || [];
    let counter = 0;
    let result = [];

    
    
    
    // check if browser is Edge and search engine is Bing
    if (browserEnvironmentData.BrowserFamily === "Edge" && data.searchEngine === "bing") {
        if (urls.length > 0) {
            result = urls.map(x => x.replace('ntb=1', 'ntb=F'));
        }
    } else {
        result = urls;
    }

    for (let i = 0; i < result.length; i++) {
        fetch(result[i])
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            
            chrome.windows.getCurrent(window => {
                chrome.tabs.query({ active: true, windowId: window.id }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            message: 'scrapeDom',
                            data: {
                                url: result[i],
                                html: html
                            }
                        }, (response) => {
                            
                            setTimeout(() => {
                                getTorrentData(response).then((data) => {
                                    counter++;
                                    
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        message: 'torrentData',
                                        last: (counter === 1) ? true : false,
                                        searchQuery: searchQuery,
                                        numSites: urls.length,
                                        data
                                    });
                                });
                            }, 1000);
                        });
                    }
                });
            });
        })
        .catch((error) => {
            
        });
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.what) {
        case 'pageData': 
            
            let data = request.data;
            webscraper(data);
            if (data?.hasTorrentWords === true) {
                sendResponse({
                    info: "pageData received",
                    hasTorrentWords: true
                });
            } else {
                sendResponse({
                    info: "pageData received",
                    hasTorrentWords: false
                });
            }
        break;
        case 'badgeCount':
            chrome.action.setBadgeText({
                text: (request.count).toString(), 
                tabId: sender.tab.id
            });
            sendResponse({ number: request.count });
        break;
        case 'activateLicense':
            license.activateKey(request.data.licenseKey).then((result) => {
                
                if (result === true) {
                    sendResponse({ request: true });
                } else {
                    sendResponse({ request: false });
                }
            });
        break;
        case 'revokeLicense':
            revokeLicenseKey();
            sendResponse({request: true});
        break;
        case 'deactivateLicense':
            chrome.storage.local.remove("licenseData");
            sendResponse({request: true});
        break;
        case 'requestPermissions':
            chrome.permissions.request({
                permissions: request.permissions
            }, (granted) => {
                if (granted) {
                    sendResponse({ request: true });
                } else {
                    sendResponse({ request: false });
                }
            });
        break;
        case 'containsPermissions':
            chrome.permissions.contains({
                permissions: request.permissions
            }, (hasPermissions) => {
                if (hasPermissions) {
                    sendResponse({ request: true });
                } else {
                    sendResponse({ request: false });
                }
            });
        break;
        case 'requestPermissionBanner':
            chrome.storage.local.get(['permissionDate'], (data) => {
                if (data.permissionDate !== undefined) {
                    let result = Math.abs(data.permissionDate - Date.now()) / 1000;
                    let days = Math.floor(result / 86400);
                    let minutes = Math.floor(result / 60) % 60;
                    
                    if (days >= 7) {
                        chrome.storage.local.set({permissionDate: Date.now()});
                        chrome.storage.local.set({ openPanelCount: 0 });
                        sendResponse({ count: 0 });
                    } else {
                        chrome.storage.local.get(['openPanelCount'], (data) => {
                            
                            if (data.openPanelCount < 2) {
                                chrome.storage.local.set({ openPanelCount: data.openPanelCount + 1 });
                                sendResponse({ count: data.openPanelCount + 1 });
                            }
                        });
                    }
                } else {
                    chrome.storage.local.set({ permissionDate: Date.now() });
                    chrome.storage.local.set({ openPanelCount: 0 });
                    sendResponse({ count: 0 });
                }
            });
        break;
        case 'eventType':
            telemetry.sendMetaEvent("UIAction", { ActionType: request.name });
            sendResponse({ event: 'event UIAction sent' });
        break;
        case 'sendListDownloadEvent':
            telemetry.sendMetaEvent("TrackEvent", { Category: 'User Action', Action: 'UI is Open', Label: 'ui-open' });

            urlStatusState(request.url).then((status) => {
                telemetry.sendMetaEvent("ListDownload", { SearchEngine: request.hostname, host: request.hostname, SearchQuery: request.searchQuery, QueryInput: request.queryInput, NumberRelevantSites: request.total, NumberFlaggedTorrents: request.badTorrents, HttpStatus: status });
            });
            sendResponse({ event: 'event ListDownload sent' });
        break;
        case 'popupSearchBar':
            telemetry.sendMetaEvent("TrackEvent", { Category: 'User Action', Action: 'Top Bar Search', Label: 'search' });
            sendResponse({ event: 'event popupSearchBar sent' });
        break;
    }
    return true;
});

// On badge icon click action
chrome.action.onClicked.addListener((tab) => {
    
    
    if (tab.status == 'complete' && /^http/.test(tab.url)) {
        chrome.tabs.sendMessage(tab.id, {
            text: 'togglePopup',
            payload: {
                tabId: tab.id
            }
        });
    }

    
    if (getDomainName(tab.url) == "https://chrome.google.com" || tab.url == "chrome://newtab/" || tab.url == "chrome://extensions/" || tab.url == "edge://extensions/" || tab.url == "edge://newtab/" || getDomainName(tab.url) == "https://microsoftedge.microsoft.com") {
        chrome.tabs.create({ url: 'https://www.google.com/', selected: true, active: true }, (newTab) => {
            
            setTimeout(() => {
                chrome.tabs.sendMessage(newTab.id, {
                    text: 'togglePopup'
                });
            }, 3000);
        });
    }
});