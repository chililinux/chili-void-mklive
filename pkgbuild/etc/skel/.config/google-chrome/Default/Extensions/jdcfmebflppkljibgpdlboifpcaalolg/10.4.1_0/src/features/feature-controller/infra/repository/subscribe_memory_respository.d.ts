import { Repository } from '../../../../shared/lib/repository';
import { Subscribe } from '../../domain';
import SubscribeRepository from './subscribe_repository';
declare class SubscribeMemoryRepository implements SubscribeRepository {
    readonly repository: Repository;
    private static key;
    constructor(repository: Repository);
    save(data: {
        [x: string]: Subscribe;
    }): Promise<void>;
    get(name: string): Promise<any>;
    getAll(): Promise<any>;
    remove(name: string): Promise<void>;
}
export default SubscribeMemoryRepository;
