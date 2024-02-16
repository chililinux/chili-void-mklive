import { Customer, CustomerGateway, MeRepository } from '../domain';
declare class Me {
    readonly repository: MeRepository;
    readonly gateway: CustomerGateway;
    constructor(repository: MeRepository, gateway: CustomerGateway);
    execute(param?: Param): Promise<Customer | undefined>;
}
type Param = {
    include?: string[];
};
export default Me;
