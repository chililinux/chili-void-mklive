import { Repository } from '../../../../shared/lib/repository';
import { Customer, MeRepository } from '../../domain';
declare class MeStorageRepository implements MeRepository {
    readonly repository: Repository;
    KEY: string;
    constructor(repository: Repository);
    get(): Promise<Customer>;
    save(customer: Customer): Promise<any>;
    remove(): Promise<void>;
}
export default MeStorageRepository;
