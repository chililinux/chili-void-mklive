export function authUserToken(received401: any): Promise<any>;
/**
* Makes sure to remove the extension-mzsync (user token) cookie.
* This method is usually called:
* - on a repeated 401 error OR
* - if a problem occurs while fetching the new user token.
*/
export function logout(): Promise<void>;
/**
* @return true if it has a client token that can be used
*         false otherwise
*/
export function hasClientToken(): Promise<boolean>;
/**
* @return true if it has a user token that can be used
*         false otherwise
*/
export function hasUserToken(): Promise<boolean>;
/**
* Sends a request to the BFF endpoint to fetch the client token to be used
* for future non-user-dependant requests.
* If the request is successful, it stores the resulting client token in the
* local storage.
* The token will expire and disappear after a time informed in the response.
*/
export function fetchAccessToken(): Promise<boolean>;
export function authClientToken(received401: any): Promise<any>;
/**
* Verifies if either the cookie `mzsync` or the cookie `mzsync-r` is present,
* as this confirms the existence of some user session on the Méliuz website.
* A session is considered "present" when it is either active (mzsync) or can
* be revived (mzsync-r).

* The terminology is also described in the session sharing ADR.
* @see https://github.com/meliuz/adr/local/client-site/aprovadas/site-extension-session-sharing.md
*/
export function hasUserWebsiteSession(): Promise<boolean>;
/**
 *
 * @returns {Promise<any>} token if the user has token cookie on the website
 */
export function getUserToken(): Promise<any>;
/**
 * @returns {Promise<any>} token on local storage
 */
export function getClientToken(): Promise<any>;
export function hasToken(tokenName: any): Promise<boolean>;
export function authToken(tokenName: any, received401: any): Promise<any>;
export function canRefreshToken(tokenName: any): Promise<boolean>;
export function getToken(tokenName: any): Promise<any>;
/**
* Sends a request to the client-site endpoint to generate a user token for the
* extension to use.
* The user token is not returned in the response, but rather it is persisted as
* a cookie `extension-mzsync-v2` in on the Méliuz website.
* The token will expire and disappear after a time informed in the response.
* @returns {Promise<any>} cookie if the user has a session on the website
*/
export function fetchUserToken(): Promise<any>;
