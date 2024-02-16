import { Tab } from '../../../shared/lib/browser';
import { CapUrlRepository } from '../domain/repositories';
declare class CapUrlActivation {
    readonly capUrlStorageRepository: CapUrlRepository;
    readonly tab: Tab;
    constructor(capUrlStorageRepository: CapUrlRepository, tab: Tab);
    execute(): Promise<void>;
}
export default CapUrlActivation;
