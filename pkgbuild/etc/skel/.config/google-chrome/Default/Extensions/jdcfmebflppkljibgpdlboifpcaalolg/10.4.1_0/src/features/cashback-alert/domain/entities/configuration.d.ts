declare class Configuration {
    partners: {
        [partnerId: number]: any;
    };
    skipDomains: string[];
    blockedByFeatures: string[];
    abTest: boolean[];
    abTestControlGroup: string;
    abTestSideDefault: string | null;
    searchEngines: {
        [key: string]: string[];
    };
}
export default Configuration;
