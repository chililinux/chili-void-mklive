import { Configuration } from '../domain';
import { StorageLocalRepository } from '../../../shared/lib/repository';
import { Tab } from '../../../shared/lib/browser';
import { Dispatch } from '../../../shared/lib/event';
declare class CheckActiveInTest {
    readonly configuration: Configuration;
    readonly repository: StorageLocalRepository;
    readonly tab: Tab;
    validateItemsInCart: Dispatch;
    constructor(configuration: Configuration, repository: StorageLocalRepository, tab: Tab);
    execute(): Promise<any>;
}
export default CheckActiveInTest;
