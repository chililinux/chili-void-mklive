import { Repository } from '../../../../shared/lib/repository';
import { CapContext } from '../../domain/entities/cap';
import { CapRepository } from '../../domain/repositories';
declare class CapStorageRepository implements CapRepository {
    readonly repository: Repository;
    readonly context: CapContext;
    static KEY: string;
    constructor(repository: Repository, context: CapContext);
    get(): Promise<number>;
    save(expiresIn: number): Promise<void>;
    remove(): Promise<void>;
}
export default CapStorageRepository;
