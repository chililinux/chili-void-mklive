interface TabRepository {
    save(tab: any): Promise<void>;
    get(tabId: number): Promise<any>;
    remove(tabId: number): Promise<any>;
}
export default TabRepository;
