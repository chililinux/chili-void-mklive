export type Utm = 'utm_source' | 'utm_medium' | 'utm_campaign';
interface ABTest {
    a: {
        title: string;
        img: string;
        items: string[][];
    };
    b: {
        title: string;
        img: string;
        items: string[][];
    };
}
interface UIData {
    meliuzLogo: string;
    title: string;
    img: string;
    items: string[][];
    options?: {
        label: string;
        cap: number;
    }[];
    abTest?: ABTest;
}
export interface OnInstalled {
    redirecTo: string;
    validatePathname: string;
    validateQueryparams: string[];
    instrumentation: {
        name: string;
    };
    utms: {
        Chrome: {
            utm_source: string;
            utm_medium: string;
            utm_campaign: string;
        };
        Firefox: {
            utm_source: string;
            utm_medium: string;
            utm_campaign: string;
        };
        Safari: {
            utm_source: string;
            utm_medium: string;
            utm_campaign: string;
        };
    };
    uiData: UIData;
}
export interface FirstPageOpen {
    invalidDomains: string[];
    blockedByFeatures: string[];
    cap: {
        view: number;
        close: number;
    };
    instrumentation: {
        name: string;
    };
    utms: {
        Chrome: {
            utm_source: string;
            utm_medium: string;
            utm_campaign: string;
        };
        Firefox: {
            utm_source: string;
            utm_medium: string;
            utm_campaign: string;
        };
        Safari: {
            utm_source: string;
            utm_medium: string;
            utm_campaign: string;
        };
    };
    uiData: UIData;
}
export interface PostPurchase {
    cap: {
        view: null;
        close: number;
    };
    blockedByFeatures: string[];
    instrumentation: {
        name: string;
    };
    uiData: UIData;
    purchaseCompletedUrls: string[];
}
interface Configuration {
    onInstalled: OnInstalled;
    firstPageOpen: FirstPageOpen;
    postPurchase: PostPurchase;
    validBrowsers: string[];
    abTest: boolean[];
    abTestSideDefault: 'a' | 'b';
}
export default Configuration;
