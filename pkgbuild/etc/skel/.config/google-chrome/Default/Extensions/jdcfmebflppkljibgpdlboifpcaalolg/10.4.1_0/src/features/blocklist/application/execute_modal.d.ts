import { Configuration } from '../domain';
import { Dispatch } from '../../../shared/lib/event';
import { ExecuteScript, Tab } from '../../../shared/lib/browser';
import { StorageLocalRepository } from '../../../shared/lib/repository';
declare class ExecuteModal {
    readonly browser: any;
    readonly configuration: Configuration;
    readonly executeScript: ExecuteScript;
    readonly repository: StorageLocalRepository;
    readonly tab: Tab;
    isFlagActivated: Dispatch;
    getPartnerByRef: Dispatch;
    checkCashbackIsActivated: Dispatch;
    constructor(browser: any, configuration: Configuration, executeScript: ExecuteScript, repository: StorageLocalRepository, tab: Tab);
    execute({ changeInfo, tab }: any): Promise<void>;
}
export default ExecuteModal;
