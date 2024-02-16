declare class RedirectURL {
    readonly baseURL: string;
    readonly browserName: string;
    readonly extId: string;
    readonly extVersion: string;
    constructor(baseURL: string, browserName: string, extId: string, extVersion: string);
    create(mainOfferId: number, additionalParams?: {
        [key: string]: string;
    }): string;
}
export default RedirectURL;
