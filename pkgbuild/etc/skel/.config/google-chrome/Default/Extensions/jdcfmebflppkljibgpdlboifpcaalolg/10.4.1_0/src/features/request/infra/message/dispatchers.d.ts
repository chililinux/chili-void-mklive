export declare const configGetSettings: import("../../../../shared/lib/message/feature_message_dispatch").default<any>;
export declare const bffExtension: import("../../../../shared/lib/message/feature_message_dispatch").default<any>;
export declare const customer: import("../../../../shared/lib/message/feature_message_dispatch").default<any>;
export declare const bffExtensionRefreshToken: import("../../../../shared/lib/message/feature_message_dispatch").default<any>;
export declare const customerRefreshToken: import("../../../../shared/lib/message/feature_message_dispatch").default<any>;
declare const _default: {
    'bff-extension': (data?: any) => Promise<any>;
    'bff-extension-refresh-token': (data?: any) => Promise<any>;
    customer: (data?: any) => Promise<any>;
    'customer-refresh-token': (data?: any) => Promise<any>;
};
export default _default;
