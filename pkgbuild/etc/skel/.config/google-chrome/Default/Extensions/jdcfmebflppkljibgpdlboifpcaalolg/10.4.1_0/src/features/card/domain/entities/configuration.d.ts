interface Configuration {
    url: string;
    utmData: {
        source: string;
        medium: string;
    };
    uiData: {
        meliuzLogo: string;
        meliuzCardImage: string;
        buttonText: string;
        bottomText: string;
        options: string[];
        meliuz_card_offer: {
            title: string;
            description: string;
        };
        meliuz_card: {
            title: string;
            description: string;
        };
    };
    contexts: {
        general: {
            cap: number;
        };
        onNavigation: {
            cap: number;
            utmData: {
                campaign: string;
            };
            skipDomains: string[];
            blockedByFeatures: string[];
        };
        googleSearch: {
            cap: number;
            utmData: {
                campaign: string;
            };
            skipDomains: string[];
            blockedByFeatures: string[];
        };
        postPurchase: {
            cap: number;
            utmData: {
                campaign: string;
            };
            blockedByFeatures: string[];
        };
    };
    status: {
        [key: string]: {
            uiData: {
                buttonText: string;
                bottomText: string;
                title: string;
                description: string;
            };
            instrumentation: {
                name: string;
            };
        };
    };
}
export default Configuration;
