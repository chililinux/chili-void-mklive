import { Repository } from '../../../../shared/lib/repository';
import StaticFileRepository from './static_file_repository';
declare class StaticFileStorageLocalRepository implements StaticFileRepository {
    readonly repository: Repository;
    constructor(repository: Repository);
    get(key: string): Promise<JSON>;
    save(key: string, data: JSON, expiration?: number): Promise<any>;
}
export default StaticFileStorageLocalRepository;
