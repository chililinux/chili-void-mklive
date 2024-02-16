export function sendEvents(data: any, successCallback: any, errorCallback: any): Promise<void>;
export function acceptedTerms(data: any, successCallback: any, errorCallback: any): Promise<void>;
export function sendInstallEvent(data: any, successCallback: any, errorCallback: any): void;
export function sendInstallEventV2(data: any): Promise<any>;
export function getUserDetails(successCallback: any, errorCallback: any): void;
export function getLgpdDetails(isUserLoggedIn: any, successCallback: any): Promise<void>;
export function getPartners(): Promise<import("axios").AxiosResponse<any, any>>;
export function getTraceability(predictData: any, successCallback: any, errorCallback: any): void;
export function getSettingsTraceability(): Promise<import("axios").AxiosResponse<any, any>>;
export function getCheckoutPagesUrl(successCallback: any, errorCallback: any): void;
export function getConfiguration(): Promise<any>;
export function partnersEtag(etag: any): boolean;
export function getLoginUrl(): string;
export function getAllOffersUrl(): string;
export function getHomeHotDeals(successCallback: any, errorCallback: any): void;
export function getCashbackOffersV2(partnerIds: any, userAuthenticated: any, feature?: null): Promise<{
    data: any;
}>;
export function getCashbackOffers(partnerIds: any, userAuthenticated: any, successCallback: any, errorCallback: any, feature: any): Promise<void>;
/**
 * Calls the cashback-offers endpoint which performs premium user cashback calculations.
 *
 */
export function getCashbackOffersDynamic(partnerIds: any, userAuthenticated: any, feature: any): Promise<any>;
/**
 * Calls the cashback-offers endpoint which returns the static cashback value.
 *
 */
export function getCashbackOffersStatic(partnerIds: any): Promise<any>;
export function sendEmailToUser(data: any, successCallback: any, errorCallback: any): void;
export function sendEmailInstall(data: any, errorCallback: any): void;
export function getReferralCampaign(successCallback: any, errorCallback: any): void;
export function getBlacklist(): Promise<import("axios").AxiosResponse<any, any>>;
export function getTrendOffers(successCallback: any, errorCallback: any): void;
export function getSidebarProducts(info: any, successCallback: any): Promise<void>;
export function getSidebarPartners(info: any, successCallback: any): Promise<void>;
export function getComparatorProducts(queryParams: any, successCallback: any): void;
export function getNonPartnerTracking(): Promise<import("axios").AxiosResponse<any, any>>;
export function getPartnerTrackingList(): Promise<import("axios").AxiosResponse<any, any>>;
export function getGoogleSidebarConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getPostPurchaseConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getBannerConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getWhitelistConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getGreyPartnersAbcTest(): Promise<import("axios").AxiosResponse<any, any>>;
export function getTipConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getClearCartConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getComparatorConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getPartnerComparatorConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getOnboardingConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getCashbackByCategory(partnerId: any): Promise<any>;
export function getCouponApplierBlacklist(): Promise<import("axios").AxiosResponse<any, any>>;
export function getCAA(): Promise<import("axios").AxiosResponse<any, any>>;
export function getConditionsNotDisplay(): Promise<import("axios").AxiosResponse<any, any>>;
export function getBlockPopupInPartnerConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getCoupons(partnerId: any): Promise<any>;
export function getTrackingToQuatroConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function cashbackEvaluateForNonPartnerConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function meliuzTravelTrackingConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getQuatroOfferModalConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getBannerCashbackConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getTabSuggesterConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getIncrementabilityConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getCollectDataSearchEnginesConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
export function getPartnerHomeRules(partnerId: any): Promise<any>;
export function getReminderConfiguration(): Promise<import("axios").AxiosResponse<any, any>>;
