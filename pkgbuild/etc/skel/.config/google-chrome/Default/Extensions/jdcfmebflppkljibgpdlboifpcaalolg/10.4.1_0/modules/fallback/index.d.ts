export function checkFallbackIsActive(): Promise<boolean>;
export function getFallbackConfig(): Promise<any>;
export function setFallbackConfig(fallbackConfig: any): Promise<void>;
export function overrideFeatureFlags(isFallbackActive: any): Promise<void>;
export function handleRedirectToFallback(request: any): Promise<boolean>;
