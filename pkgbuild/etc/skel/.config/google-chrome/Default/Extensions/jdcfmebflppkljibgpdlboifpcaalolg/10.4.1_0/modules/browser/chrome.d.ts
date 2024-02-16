export = Chrome;
declare class Chrome extends BaseBrowser {
    constructor();
    name: string;
    browserAction: any;
    scripting: any;
    storage: {
        sync: any;
        session: any;
        local: any;
    };
    action: any;
    executeScript: (tabId: any, params: any, callback: any) => Promise<void>;
    tabsQuery: (params: any, callback: any) => Promise<void>;
}
import BaseBrowser = require("./baseBrowser");
