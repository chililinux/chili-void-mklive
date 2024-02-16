import { Repository } from '../../../../shared/lib/repository';
import { CapRepository } from '../../domain/repositories';
import { CapDTO } from '../../domain/repositories/cap_repository';
declare class CapStorageRepository implements CapRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(): Promise<CapDTO>;
    save(data: CapDTO): Promise<void>;
    remove(partnerId: number): Promise<void>;
}
export default CapStorageRepository;
