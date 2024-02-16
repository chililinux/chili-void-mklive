/**
* @return true if it has a client token that can be used
*         false otherwise
*/
export function hasClientToken(): Promise<boolean>;
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
* @return {string} client token (bff) if present in the local storage
*         undefined otherwise
*/
export function getClientToken(): string;
