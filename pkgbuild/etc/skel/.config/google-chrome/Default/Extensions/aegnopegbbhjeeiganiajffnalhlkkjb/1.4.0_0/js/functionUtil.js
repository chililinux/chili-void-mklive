const getUrlParameterFromString = (url, name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const getHostNameFromSearchEngine = (url) => {
    let searchEnginesArray = ["yahoo", "google", "bing", "privatesearch", "yandex", "duckduckgo"];
    for (let i = 0; i < searchEnginesArray.length; i++) {
        if (url.includes(searchEnginesArray[i])) {
            return searchEnginesArray[i];
        }
    }
    return null;
}

const getParameterByName = (url, name) => {
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const getUrlFromYahooRedirectUrI = (url) => {
    let mySubString = url.substring(
        url.lastIndexOf("/RU=") + 4, 
        url.lastIndexOf("/RK=")
    );
    if (mySubString == "htt") {
        return (url);
    }
    return decodeURIComponent(mySubString);
}

const validURL = (str) => {
    let pattern = new RegExp(/^https?:\/\//i);
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

const getDomainName = (url) => {
    var m = url.toString().match(/^https?:\/\/[^/]+/);
    return m ? m[0] : null;
}

const validateAnnounceUri = (announce) => {
    let newAnnounce = [];

    if (Array.isArray(announce)) {
        for (let i = 0; i < announce.length; i++) {
            if (announce[i] !== '') {
                newAnnounce.push(announce[i]);
            }
        }
    }

    return newAnnounce;
}

const mapTorrentTrackers = (data) => {
    let arr = [];
    let uniqueArr = [];

    data.map(x => uniqueArr.filter(a => a.infoHash == x.infoHash).length > 0 ? null : uniqueArr.push(x));
    

    for (let i = 0; i < uniqueArr.length; i++) {
        if (uniqueArr[i].torrentData) {
            let torrents = uniqueArr[i].torrentData;
            let announce = torrents.announce;
            let arrAnnounce = [];
            if (announce !== undefined) {
                if (!Array.isArray(announce)) {
                    if (announce !== null && announce !== '') {
                        arrAnnounce.push(announce);
                    } else {
                        arrAnnounce.push();
                    }
                } else {
                    arrAnnounce = validateAnnounceUri(announce);
                }
                arr.push({ infoHash: torrents.infoHash, trackers: arrAnnounce });
            }
        }
    }

    return {
        data: arr
    }
}

const mergeTorrents = (torrents, extra) => {
    for (let i = 0; i < torrents.length; i++) {
        let torrentData = torrents[i].torrentData;
        for (let x = 0; x < torrentData.length; x++) {
            for (let j = 0; j < extra.length; j++) {
                if (torrentData[x].infoHash === extra[j].infoHash) {
                    torrentData[x].seeders = extra[j].seeders;
                    torrentData[x].leechers = extra[j].leechers;
                    torrentData[x].status = extra[j].status;
                    torrentData[x].downloads = extra[j].downloads;
                }
            }
        }
    }

    return [
        ...torrents
    ]
}

const socketIoResponse = (data) => {
    return new Promise(function (resolve, reject) {
        let torrentData = data;
        let licenseData = null;
        let licenseKey = null;
        let expired = true;
        let arr = [];

        chrome.storage.local.get({ 'licenseData': null }, (license) => {
            
            if (license.licenseData !== null) {
                licenseData = license.licenseData;
            }

            if (licenseData != undefined && licenseData != null) {
                
                licenseKey = licenseData.license;
            }

            // var socket = io('ws://127.0.0.1:3000/', {transports: ['websocket']});
            let socket = io('wss://bsa.adaware.com', {transports: ['websocket']});

            if (licenseKey != null) {
                
                let proData = {};
                proData.license = licenseData.license;
                proData.data = torrentData.data;
                
                socket.emit("torrentInfoRequestPro", JSON.stringify(proData));
            } else {
                
                let freeData = {};
                freeData = torrentData;
                
                socket.emit("torrentInfoRequestPro", JSON.stringify(freeData));
            }

            socket.on("torrentInfoResponse", (torrentResData) => {
                let res = JSON.parse(torrentResData);
                
                arr.push(res);
            });

            socket.on("torrentInfoProResponse", (torrentResData) => {
                let res = JSON.parse(torrentResData);
                arr.push(res);
            });

            socket.on("torrentInfoError", (error) => {
                
                reject(error);
            });

            socket.on("connect_error", error => {
                
                reject(error);
            });

            socket.on('error', (error) => {
                
                reject(error);
            });

            socket.on("disconnect", () => {
                resolve(arr);
                
            });
        });
    });
}

const getParamByNameFromMagnetLink = (name, queryString) => {
    name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(queryString);
    return results === null ? queryString : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const add3Dots = (string, limit) => {
    let dots = "...";

    if (string === undefined) {
        string = "Unknown";
    }

    if (string === null) {
        string = "-";
    }

    if (string.length > limit) {
        // you can also use substr instead of substring
        string = string.substring(0, limit) + dots;
    }
    
    return string;
}

const getFilePixel = (title) => {

    if (title) {
        if (title === undefined) {
            title = "";
        } else {
            title.toLowerCase();
        }
    
        let pixels = ["240p", "360p", "480p", "720p", "780p", "1080p", "2160p", "4k"];
    
        for (let i = 0; i < pixels.length; i++) {
            if (title.indexOf(pixels[i]) !== -1) {
                if (pixels[i] !== undefined) {
                    return pixels[i];
                }
            }
        }
    }

    return null;
}

const getFileLanguage = (title) => {
    // 
    let lang = "Unknown";

    let regExpSqBrackets = /[^[\]]+(?=])/g;
    let regExpRnBrackets = /[^\(\]]+(?=\))/g;
    let langArr = ["en", "english", "english dubbed", "eng", "fr", "french", "it", "italian", "es", "spanish", "esp", "jpn", "multi-sub", "subs", "multi", "japanese", "multiple subtitle", "chinese", "eng-sub", "esubs", "hindi + eng", "portuguese", "english subs", "eng subs", "ag", "mx", "br", "pt", "pt-br"];

    let arrRegex = new Array(/\bRUS\b/i, /\bNL\b/, /\bFLEMISH\b/, /\bGERMAN\b/, /\bDUBBED\b/, /\b(ITA(?:LIAN)?|iTALiAN)\b/, /\bFR(?:ENCH)?\b/, /\bTruefrench|VF(?:[FI])\b/i, /\bVOST(?:(?:F(?:R)?)|A)?|SUBFRENCH\b/i, /\bMULTi(?:Lang|-VF2)?\b/i, /\bEng\b/i, /\btamil\b/i, /\btelugu\b/i, /\bSPANISH\b/i, /\bPORTUGUESE|BENGALI\b/i, /\bBENGALI\b/i, /\bRUSSIAN\b/i, /\bKOREAN\b/i, /\bFRENCH\b/i, /\bEN\b/, /\bAG\b/, /\bMX\b/, /\bBR\b/, /\bPT\b/);

    if (title) {
        if (title.match(regExpSqBrackets) !== null && title.match(regExpSqBrackets) !== undefined) {
            let t = title.toLowerCase().match(regExpSqBrackets);
            for (let i = 0; t.length > i; i++) {
                if (langArr.indexOf(t[i]) > -1) {
                    lang = t[i];
                    return lang;
                } else {
                    lang = "";
                }
            }
        }
    
        if (title.match(regExpRnBrackets) !== null && title.match(regExpRnBrackets) !== undefined) {
            let t = title.toLowerCase().match(regExpRnBrackets);
            for (let i = 0; t.length > i; i++) {
                if (langArr.indexOf(t[i]) > -1) {
                    lang = t[i];
                    return lang;
                } else {
                    lang = "";
                }
            }
        }
    
        for (let x = 0; arrRegex.length > x; x++) {
            let info = arrRegex[x].exec(title);
            if (info instanceof Array) {
                lang += " " + info[0];
            }
        }
    
        if (lang !== "") {
            return lang;
        }
    
        if (lang === "") {
            let t = title.toLowerCase().split(" ");
            for (let j = 0; t.length > j; j++) {
                if (langArr.includes(t[j])) {
                    lang = t[j];
                    return lang;
                }
            }
        }
    
        if (lang === "") {
            let t = title.toLowerCase().split(".");
            for (let j = 0; t.length > j; j++) {
                if (langArr.includes(t[j])) {
                    lang = t[j];
                    return lang;
                } 
            }
        }
    }   

    return lang || "Unknown";
}

const formatBytes = (bytes, decimals) => {
    if(bytes == 0 || bytes == undefined) return 'Unknown';

    let k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getFile = (files) => {
    let maxLength = 0;
    let file = {};
    if (files !== undefined) {
        files.map((obj) => {
            if (obj.length > maxLength) {
                maxLength = obj.length;
                file.length = obj.length;
                file.name = obj.path[0];
            }
        });
    } else {
        file.length = 0;
        file.name = "-";
    }
    
    return file;
}

const getGoodTorrents = (torrents) => {
    
    let goodTorrents = new Array();

    for (let index in torrents) {
        
        if (torrents[index].torrentHealth.status !== undefined) {
            if (torrents[index].torrentHealth.status === 1) {
                goodTorrents.push(torrents[index]);
            }
        } else {
            goodTorrents.push(torrents[index]);
        }
    }

    

    return goodTorrents;
}

const getBadTorrents = (torrents) => {
    
    let badTorrents = new Array(); 

    for (let index in torrents) {
        if (torrents[index].torrentHealth.status !== undefined) {
            if (torrents[index].torrentHealth.status !== 1) {
                badTorrents.push(torrents[index]);
            }
        }
    }

    

    return badTorrents;
}

const countBadTorrents = (torrents) => {
    let count = 0; 

    for (let index in torrents) {
        if (torrents[index].status !== undefined) {
            if (torrents[index].status === 2) {
                count++;
            }
        }
    }

    return count;
};

const mapTorrentStatus = (torrents) => {
    let goodTorrent = [];
    let badTorrent = [];

    return new Promise((resolve) => {
        for (let index in torrents) {
            let safe = [];
            let unsafe = [];
            if (torrents[index].torrentData) {
                for (let i in torrents[index].torrentData) {
                    // 
                    if (torrents[index].torrentData[i].status === 1 || torrents[index].torrentData[i].status === undefined) {
                        // 
                        safe.push(torrents[index].torrentData[i]);
                    } else {
                        // 
                        unsafe.push(torrents[index].torrentData[i]);
                    }
                }

                if (safe.length > 0) {
                    torrents[index].torrentData = safe;
                    goodTorrent.push(torrents[index]);
                }

                if (unsafe.length > 0) {
                    torrents[index].torrentData = unsafe;
                    badTorrent.push(torrents[index]);
                }
            }
        }

        resolve({
            safe: goodTorrent,
            unsafe: badTorrent
        });
    });
}

const urlStatusState = (url) => {
    return new Promise(function (resolve, reject) {
        fetch(url) 
        .then(response => {
            resolve(response.status);
        })
        .catch(error => {
            
        });
    });
}