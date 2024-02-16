export = BaseConfiguration;
declare class BaseConfiguration {
    constructor(featureName: any, callback: any, key: any, expiration?: number);
    featureName: any;
    callback: any;
    key: any;
    expiration: number;
    logger: {
        notify: (error: any, logger?: string) => void;
        setContext: (name: any, context: any) => void;
        wrap: (callback: any, parameters?: any[]) => any;
        initializeSentry: () => void;
    };
    store: {
        set: (key: any, value: any, expirationTimestamp: any) => Promise<any>;
        get: (key: any) => Promise<any>;
        remove: (key: any) => Promise<any>;
        clearAll: () => Promise<any>;
        observe: (key: any, callback: any) => void;
        removeExpiredKeys: () => Promise<any>;
        expirationKeyOf: (itemKey: any) => string;
    };
    isExpired(): Promise<boolean>;
    getExpiration(): {
        expiration: number;
    };
    get(): any;
    set(value: any): Promise<void>;
    remove(): Promise<boolean>;
    fetch(): any;
}
