let oneSecond = 1000;
let oneMinute = 60 * oneSecond;
let oneHour = 60 * oneMinute;
let oneDay = 24 * oneHour;
let lastPing;
let currentVersion = chrome.runtime.getManifest().version;
let browserEnvironment = new systemUtil.browserEnvironmentData();

let UNINSTALL_URL = "https://www.torrentscanner.co/uninstall/?";



let storeUrl = "";

if (browserEnvironment.BrowserFamily == "Edge") {
    storeUrl = "https://microsoftedge.microsoft.com/addons/*";
} else if (browserEnvironment.BrowserFamily == "Opera") {
    storeUrl = "https://addons.opera.com/*";
} else {
    storeUrl = "https://chrome.google.com/webstore/*";
}

const sendDailyActivityData = (lastPingTime) => {
    let lastPingDate = new Date(lastPingTime);
    let currentPingDate = Date.now();
    let deltaMinutes = (currentPingDate - lastPingDate.getTime()) / oneMinute;
    
    let dailyActivityData = {
        LastCallbackDate: lastPingDate.toISOString()
    };

    // Check if License localstorage exists or not
    chrome.storage.local.get({ licenseData: null }, function (result) {
        // If local data exists
        if (result.licenseData !== null) {
            // Check if license key exists in local
            if (result.licenseData.license !== null && result.licenseData.license !== undefined) {
                dailyActivityData.Status = "Pro";
                
            }
        } else {
            dailyActivityData.Status = "Free";
            
        }
    });
    
    telemetry.sendDailyActivityEvent(dailyActivityData);
};

const onAllReady = () => {
    // Daily activity counter
    lastPing = Date.now();
    setInterval(() => {
        license.expiryKey();
        sendDailyActivityData(lastPing);
        lastPing = Date.now();
    }, oneDay);
};

const onVersionReady = (lastVersion) => {
    if (lastVersion !== currentVersion) {
        storageUtil.save("version", currentVersion);
    }
};

// Only launches when all chrome browser processes are closed and is not first install or update
const onStartupHandler = () => {
    storageUtil.load("startupTime", Date.now(), (fetched) => {
        
        if (Date.now() - fetched.startupTime > oneDay) { // if last startup time is greater than 24 hours
            sendDailyActivityData(fetched.startupTime);
        }
        storageUtil.save("startupTime", Date.now());
    });
};

// Solution to send GA event for sideloading user
// onInstall we check if chrome store url exists or not
// and send event based on this
const onSideload = () => {
    chrome.tabs.query({ url: "https://chrome.google.com/*/aegnopegbbhjeeiganiajffnalhlkkjb*" }, (tabs) => {
        let sideload = false;
        if (tabs.length > 0) {
            // url exists in tabs
            sideload = false;
            // _gaq.push(['_trackEvent', 'Install', 'Manual', 'Chrome']);
            telemetry.sendMetaEvent("TrackEvent", { Category: 'Install', Action: 'Manuel', Label: 'Chrome' });
        } else {
            // url doesn't exists in tabs
            sideload = true;
            // send event to GA
            // _gaq.push(['_trackEvent', 'Install', 'Sideload', 'Chrome']);
            telemetry.sendMetaEvent("TrackEvent", { Category: 'Install', Action: 'Sideload', Label: 'Chrome' });
        }
    });
}


const onFirstInstallHandler = () => {
    let externalData = {
        "CampaignID": config.configurationData.externalData.CampaignID || "",
        "CLID": config.configurationData.externalData.CLID || "",
        "PartnerID": config.configurationData.externalData.PartnerID || "",
        "sourceTraffic": config.configurationData.externalData.sourceTraffic || "",
        'OfferID': config.configurationData.externalData.OfferID || ""
    };

    const getParametersFromStore = () => {
        

        return new Promise((resolve, reject) => {
            try {
                chrome.tabs.query({ url: storeUrl }, (tabs) => {
                    if (tabs.length > 0) {
                        let url = tabs[0].url;

                        if ((url.split("?")).length > 1) {
                            externalData.PartnerID = getUrlParameterFromString(url, "partnerId") || config.configurationData.externalData.PartnerID;
                            externalData.CampaignID = getUrlParameterFromString(url, "utm_campaign");
                            externalData.CLID = getUrlParameterFromString(url, "clId");
                            externalData.OfferID = getUrlParameterFromString(url, "offerId");
                            externalData.sourceTraffic = getUrlParameterFromString(url, "sourceTraffic");

                            let b = getUrlParameterFromString(url, "b");
                            if (b == "bt") {
                                storageUtil.save("b", "bt");
                            } else if (b == "ut") {
                                storageUtil.save("b", "ut");
                            } else {
                                storageUtil.save("b", null);
                            }

                            let key = getUrlParameterFromString(url, "l");
                            license.activateKey(key).then(function (result) {
                                
                            });
                        } else {
                            storageUtil.save("b", null);
                        }
                        
                        resolve(externalData);
                    } else {
                        
                        resolve(externalData);
                    }
                });
            } catch (err) {
                
                resolve(externalData);
            }
        });
    };

    const redirectAfterInstalled = () => {
        chrome.tabs.query({ url: storeUrl }, (tabs) => {
            if (tabs.length > 0) {
                var url = tabs[0].url;
                var urlQuery = url.slice(url.indexOf( '?' ));
                if (getUrlParameterFromString(url, "p") === "bt") {
                    if (browserEnvironment.BrowserFamily == "Opera") {
                        chrome.tabs.create({ url: "https://www.google.com/search?" + urlQuery.replace("?", "") });
                    } else {
                        chrome.tabs.create({ url: "https://www.google.com/search?" + urlQuery.replace("?", "") + "&client=opera&sourceid=opera&ie=UTF-8&oe=UTF-8" });
                    }
                } else {
                    if (getUrlParameterFromString(url, "p") === "btwebpro") {
                        checkIfBitTorrentWebPro().then((isInstalled) => {
                            if (isInstalled === true) {
                                chrome.tabs.create({ url: "https://web.utorrent.com/extension.html?success=1&" + urlQuery.replace("?", "") });
                            } else {
                                chrome.tabs.create({ url: "https://www.bittorrent.com/downloads/complete/" });
                            }
                        });
                    } else if (getUrlParameterFromString(url, "p") === "utwebpro") {
                        checkIfuTorrentWebPro().then((isInstalled) => {
                            if (isInstalled === true) {
                                chrome.tabs.create({ url: "https://web.utorrent.com/extension.html?success=1&" + urlQuery.replace("?", "") });
                            } else {
                                chrome.tabs.create({ url: "https://download-new.utorrent.com/endpoint/utweb/track/stable/os/win" });
                            }
                        });
                    }
                }
            }
        });
    };

    const checkIfBitTorrentWebPro = () => {
        return new Promise((resolve, reject) => {
            var url = "http://127.0.0.1:38565/gui/index.html";
            fetch(url)
            .then(response => {
                if (response.status == 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                
                reject(false);
            });
        });
    };

    const checkIfuTorrentWebPro = () => {
        return new Promise((resolve, reject) => {
            var url = "http://127.0.0.1:19575/gui/index.html";
            fetch(url)
            .then(response => {
                if (response.status == 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                
                reject(false);
            });
        });
    };

    const saveAndSendData = (externalData) => {
        
        trackingDataUtil.setExternalData(externalData);
        trackingDataUtil.saveExternalData();
        
        telemetry.sendCompleteInstallEvent();
        trackingDataUtil.setupUninstall(UNINSTALL_URL);
    };

    trackingDataUtil.setInstallDate().then(() => {
        
        trackingDataUtil.setInstallId().then(() => {
            
            getParametersFromStore().then(saveAndSendData);
            redirectAfterInstalled();
        });
    });
};

const onUpdatedHandler = (lastVersion) => {
    const saveAndSendData = () => {
        telemetry.sendCompleteUpdateEvent(lastVersion);
    }
    saveAndSendData();
};

const onExtensionLaunchHandler = (ev) => {
    
    let promiseList = [];
    promiseList.push(new Promise((resolve, reject) => {
        storageUtil.load("externalData", trackingDataUtil.getExternalData(), (fetched) => {
            trackingDataUtil.setExternalData(fetched.externalData);
            
            resolve("externalData");
        });
    }));

    Promise.all(promiseList).then((resolutionMessage) => {
        
        if (ev.reason === "install") {
            
            chrome.tabs.create({ url: 'https://www.torrentscanner.co/welcome/', selected: true, active: true });
            onFirstInstallHandler();
            onSideload();
        } else if (ev.reason === "update") {
            
            onUpdatedHandler(ev.lastVersion);
            setTimeout(() => {
                chrome.runtime.reload();
            }, 6000);
        } else if (ev.reason === "startup") {
            onStartupHandler();
        } else {
            
        }
    });
};

const onFirstFetchReady = (fetched) => {
    onVersionReady(fetched.version);
    onAllReady();
};

telemetry.onExtensionLaunch(onExtensionLaunchHandler);

storageUtil.load("version", "0.0.0.0", onFirstFetchReady);