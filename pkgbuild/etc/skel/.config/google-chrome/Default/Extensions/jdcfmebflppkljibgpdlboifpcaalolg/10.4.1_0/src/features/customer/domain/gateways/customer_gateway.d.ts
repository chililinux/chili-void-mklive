export type CustomerInput = {
    id: number;
    email: string;
    invite_url: string;
    name: string;
    has_online_transaction_only_purchase?: boolean;
};
interface CustomerGateway {
    me(include?: string[]): Promise<CustomerInput>;
}
export default CustomerGateway;
