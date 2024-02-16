import { Action, ExecuteScript, Tab } from '../../../shared/lib/browser';
import { ContextRepository, CapRepository } from '../domain';
declare class FirstPageOpenExecuteUI {
    readonly tab: Tab;
    readonly action: Action;
    readonly capRepository: CapRepository;
    readonly contextRepository: ContextRepository;
    readonly executeScript: ExecuteScript;
    constructor(tab: Tab, action: Action, capRepository: CapRepository, contextRepository: ContextRepository, executeScript: ExecuteScript);
    execute(): Promise<true | undefined>;
}
export default FirstPageOpenExecuteUI;
