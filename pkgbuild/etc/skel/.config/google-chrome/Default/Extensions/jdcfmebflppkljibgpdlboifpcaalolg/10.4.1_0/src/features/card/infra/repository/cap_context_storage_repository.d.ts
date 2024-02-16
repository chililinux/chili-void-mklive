import { Repository } from '../../../../shared/lib/repository';
import { CapContext } from '../../domain/entities/cap';
declare class CapContextStorageRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(): Promise<string>;
    save(context: CapContext): Promise<void>;
    remove(): Promise<void>;
}
export default CapContextStorageRepository;
