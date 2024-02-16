'use strict';

var msToTime = function (duration) {
    var seconds = parseInt((duration/1000)%60);
    var minutes = parseInt((duration/(1000*60))%60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    
    return  minutes + ":" + seconds;
}

var validateUrl = function (url) {
    var parsedUrl = new URL(url);
    var toBlock = {
        blockedProtocol : [
            "about:",
            "chrome:",
            "chrome-extension:"
        ],
        blockedHostname : [
            "localhost",
            "newtab"
        ]
    };

    if (toBlock.blockedProtocol.indexOf(parsedUrl.protocol) == - 1 && toBlock.blockedHostname.indexOf(parsedUrl.hostname) == -1) {
        return true;
    } else {
        return false;
    }
}

var parseDomain = function (url) {
    var domain;

    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    domain = domain.split(':')[0];
    domain = domain.replace("www.", "");

    return domain;
}