import { Repository } from '../../../../shared/lib/repository';
import TabRepository from './tab_repository';
declare class TabMemoryRepository implements TabRepository {
    readonly repository: Repository;
    private static key;
    constructor(repository: Repository);
    save(data: any): Promise<void>;
    get(tabId: number): Promise<any>;
    remove(tabId: number): Promise<void>;
}
export default TabMemoryRepository;
