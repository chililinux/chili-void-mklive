// Send message to page to notify Trustnav Extension is installed.

var extension = {
    id: chrome.runtime.id,
    version: chrome.runtime.getManifest().version,
    type: configServer.extensionType
};

window.postMessage({
    type: 'trustnav_extension',
    data: extension
}, '*');