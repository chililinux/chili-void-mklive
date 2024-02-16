import { Customer } from '../entities';
interface MeRepository {
    get(): Promise<Customer>;
    save(customer: Customer): Promise<any>;
    remove(): Promise<void>;
}
export default MeRepository;
