'use strict';

var configServer = {
    api: "https://api-production.trustnav.com",
    website: "https://www.trustnav.com",
    accountUrl: "https://account.trustnav.com",
    sessionUrl: 'https://get.trustnav.com/session/index.html',
    installAdblockerUrl: "https://get.trustnav.com/thankyou/",
    extensionKey: "safebrowsing",
    extensionType: "safebrowsing",
    cookies: {
        accountToken: {
            url: 'https://account.trustnav.com/',
            name: 'account_token'
        }
    },
    env: {
        vendor: 'chrome',
        production: true
    },
    logger: {
        logLevel: 'info',
        levels: ['debug', 'verbose', 'info', 'warn', 'error', 'crit'],
    },
	searchProvidersFallback: [{
		id: 8,
		name: "Trustnav.com",
		recommended: 1,
		search_url: "https://search.trustnav.com/?q={param}&suid={suid}"
	}],
    amplitude: {
        apiKey: '652b17b43ea9f33acc1f4e61ba208a38'
    }
};