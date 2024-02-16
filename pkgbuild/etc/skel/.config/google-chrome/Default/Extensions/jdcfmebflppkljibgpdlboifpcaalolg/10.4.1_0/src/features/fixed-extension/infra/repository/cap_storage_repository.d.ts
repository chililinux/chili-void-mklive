import { Repository } from '../../../../shared/lib/repository';
import { Context } from '../../domain/entities';
import { CapRepository } from '../../domain/repositories';
declare class CapStorageRepository implements CapRepository {
    readonly repository: Repository;
    readonly context: Context;
    static KEY: string;
    constructor(repository: Repository, context: Context);
    get(): Promise<any>;
    save({ cap, tab, type }: {
        cap: number;
        tab: {
            id: number;
            url: string;
        };
        type: string;
    }): Promise<void>;
    remove(): Promise<void>;
}
export default CapStorageRepository;
