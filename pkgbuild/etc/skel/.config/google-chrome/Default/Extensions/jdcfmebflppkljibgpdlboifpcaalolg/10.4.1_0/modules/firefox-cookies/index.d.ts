import EventEmitter = require("events");
export let events: EventEmitter;
/**
* Verify if the extension has user permission to storing/fetching cookies.
* @return true if the extension is running on chrome or has the access enabled
*         false if the extension is running on firefox AND has access to cookies disabled
*/
export function isCookieAccessEnabled(): Promise<boolean>;
export function enableCookieAccess(): Promise<void>;
export function disableCookieAccess(): Promise<void>;
