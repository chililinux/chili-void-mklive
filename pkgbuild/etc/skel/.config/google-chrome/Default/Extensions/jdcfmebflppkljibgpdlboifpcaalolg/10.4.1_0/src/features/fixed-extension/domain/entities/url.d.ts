declare class Url {
    readonly currentUrl: string;
    constructor(currentUrl: string);
    matchesConfig(configUrls: string[]): boolean;
}
export default Url;
