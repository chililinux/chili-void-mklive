import { CapRepository } from '../../domain/repositories';
declare class CapStorageRepositoryFactory {
    static getOnNavigationContextRepository(browser: any): CapRepository;
    static getGoogleSearchContextRepository(browser: any): CapRepository;
    static getPostPurchaseContextRepository(browser: any): CapRepository;
}
export default CapStorageRepositoryFactory;
