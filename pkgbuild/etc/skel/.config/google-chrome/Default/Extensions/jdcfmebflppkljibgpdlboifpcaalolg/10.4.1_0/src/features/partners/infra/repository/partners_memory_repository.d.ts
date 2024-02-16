import { Repository } from '../../../../shared/lib/repository';
import PartnersRepository from './partners_repository';
declare class PartnersMemoryRepository implements PartnersRepository {
    readonly repository: Repository;
    constructor(repository: Repository);
    getAll(): Promise<any>;
}
export default PartnersMemoryRepository;
