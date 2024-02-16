import FeatureStatusRepository from './feature_status_repository';
declare class FeatureStatusMemoryRepository implements FeatureStatusRepository {
    static DATA: any;
    constructor();
    save(tabId: number, data: any): void;
    get(tabId: number): any;
    getAll(): any;
    remove(tabId: number): void;
}
export default FeatureStatusMemoryRepository;
