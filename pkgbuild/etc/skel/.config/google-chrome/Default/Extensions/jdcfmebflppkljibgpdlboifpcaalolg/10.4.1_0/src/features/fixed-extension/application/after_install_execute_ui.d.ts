import { ExecuteScript, Tab } from '../../../shared/lib/browser';
import { FixedExtensionRepository } from '../domain';
declare class AfterInstallExecuteUI {
    readonly tab: Tab;
    readonly repository: FixedExtensionRepository;
    readonly executeScript: ExecuteScript;
    constructor(tab: Tab, repository: FixedExtensionRepository, executeScript: ExecuteScript);
    execute({ changeInfo, tab }: any): Promise<void>;
}
export default AfterInstallExecuteUI;
