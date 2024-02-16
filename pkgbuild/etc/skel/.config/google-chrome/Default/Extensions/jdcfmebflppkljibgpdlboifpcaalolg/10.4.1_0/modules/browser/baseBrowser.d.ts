export = BaseBrowser;
declare class BaseBrowser {
    constructor(currentBrowser: any);
    logger: {
        notify: (error: any, logger?: string) => void;
        setContext: (name: any, context: any) => void;
        wrap: (callback: any, parameters?: any[]) => any;
        initializeSentry: () => void;
    };
    browser: any;
    runtime: any;
    cookies: any;
    tabs: any;
    windows: any;
    storage: any;
    alarms: any;
    isChrome: boolean;
    getURL(path: any): any;
    executeScript(): void;
}
