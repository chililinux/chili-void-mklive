export function isUserLoggedIn(): Promise<any>;
/**
 * @param  {object}
 * @return {User}
 */
export function userFactory(data: any): {
    get(): Promise<any>;
    remove(): Promise<void>;
    set(data: any): Promise<{
        id: any;
        name: any;
        email: any;
        balance: any;
        image: any;
        confirmed_balance: any;
        pending_balance: any;
        minimum_withdrawal_balance: any;
        refUrl: any;
        accepted_current_terms: any;
        current_terms: any;
    }>;
    getId(): Promise<any>;
    removeId(): Promise<void>;
    setId(id: any): Promise<any>;
};
export function getUser(): any;
export function getUserId(): any;
export function userLogout(): Promise<void>;
export function getUserDetails(callback: any): Promise<void>;
export function updateUserCredentials(): Promise<any>;
export function removeCache(): Promise<void>;
