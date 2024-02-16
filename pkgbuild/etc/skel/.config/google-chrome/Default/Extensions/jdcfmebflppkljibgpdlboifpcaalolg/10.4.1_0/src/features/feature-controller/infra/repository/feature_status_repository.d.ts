interface FeatureStatusRepository {
    save(tabId: number, feature: any): void;
    get(tabId: number): any;
    getAll(): any;
    remove(tabId: number): any;
}
export default FeatureStatusRepository;
