import { Repository } from '../../../../shared/lib/repository';
import { GeneralCapRepository } from '../../domain/repositories';
declare class GeneralCapStorageRepository implements GeneralCapRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(): Promise<number>;
    save(data: number): Promise<void>;
    remove(): Promise<void>;
}
export default GeneralCapStorageRepository;
