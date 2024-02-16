import { CustomerInput } from '../gateways/customer_gateway';
type Field = 'id' | 'name' | 'email' | 'inviteURL' | 'cashbackReceived';
declare class Customer {
    [field: string | Field]: any;
    format(input: CustomerInput): this;
}
export default Customer;
