export function get(): Promise<any>;
export function remove(): Promise<void>;
export function set(data: any): Promise<{
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
export function getId(): Promise<any>;
export function removeId(): Promise<void>;
export function setId(id: any): Promise<any>;
