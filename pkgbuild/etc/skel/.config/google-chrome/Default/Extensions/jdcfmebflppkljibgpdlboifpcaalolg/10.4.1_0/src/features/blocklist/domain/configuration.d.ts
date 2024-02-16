declare class Configuration {
    readonly abTest: boolean[];
    readonly abType: string;
    readonly blocklist: number[];
    readonly defaultSide: string;
    readonly testSide: string;
    readonly invalidQueryParams: string[];
    readonly abTestQueryParamKey: string;
    constructor(abTest: boolean[], abType: string, blocklist: number[], defaultSide: string, testSide: string, invalidQueryParams: string[], abTestQueryParamKey: string);
}
export default Configuration;
