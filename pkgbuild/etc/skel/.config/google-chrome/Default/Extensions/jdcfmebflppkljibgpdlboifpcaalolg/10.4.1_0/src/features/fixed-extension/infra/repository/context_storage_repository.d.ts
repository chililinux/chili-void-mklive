import { FixedExtensionRepository } from '../../domain';
import { Context } from '../../domain/entities';
declare class ContextStorageRepository {
    readonly fixedExtensionRepository: FixedExtensionRepository;
    static KEY: string;
    constructor(fixedExtensionRepository: FixedExtensionRepository);
    get(): Promise<string>;
    save(context: Context): Promise<void>;
    remove(): Promise<void>;
}
export default ContextStorageRepository;
