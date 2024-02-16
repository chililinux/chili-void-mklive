'use strict';

var getFrameHtml = function(htmlFileName) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", chrome.extension.getURL(htmlFileName), false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

var parseDomain = function(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    domain = domain.replace("www.", "");
    return domain;
}

var validateUrl = function(url) {
    var parsedUrl = new URL(url);
    var toBlock = {
        blockedProtocol: [
            "about:",
            "chrome:",
            "chrome-extension:"
        ],
        blockedHostname: [
            "localhost",
            "newtab"
        ]
    }

    if (toBlock.blockedProtocol.indexOf(parsedUrl.protocol) == -1 && toBlock.blockedHostname.indexOf(parsedUrl.hostname) == -1) {
        return true;
    } else {
        return false;
    }
}
