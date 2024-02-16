import { CustomerGateway } from '../../domain';
import { CustomerInput } from '../../domain/gateways/customer_gateway';
declare class CustomerHTTPGateway implements CustomerGateway {
    me(include?: string[]): Promise<CustomerInput>;
}
export default CustomerHTTPGateway;
