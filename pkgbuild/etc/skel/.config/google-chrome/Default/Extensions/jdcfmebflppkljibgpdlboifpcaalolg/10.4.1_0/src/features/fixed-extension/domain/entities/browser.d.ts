declare class Browser {
    readonly validBrowsers: string[];
    constructor(validBrowsers: string[]);
    isValidBrowser(currentBrowser: string): boolean;
}
export default Browser;
