import { Repository } from '../../../../shared/lib/repository';
import { CapRepository } from '../../domain/repositories';
declare class CapStorageRepositoryFactory {
    static getFirstPageOpenContextRepository(repository: Repository): CapRepository;
    static getPostPurchaseContextRepository(repository: Repository): CapRepository;
}
export default CapStorageRepositoryFactory;
