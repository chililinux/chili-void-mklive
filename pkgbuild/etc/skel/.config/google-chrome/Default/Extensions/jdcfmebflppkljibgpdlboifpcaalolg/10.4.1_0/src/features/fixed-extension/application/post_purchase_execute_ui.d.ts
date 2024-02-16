import { Action, ExecuteScript, Tab } from '../../../shared/lib/browser';
import { Dispatch } from '../../../shared/lib/event';
import { ContextRepository, CapRepository } from '../domain';
declare class PostPurchaseExecuteUI {
    readonly tab: Tab;
    readonly action: Action;
    readonly capRepository: CapRepository;
    readonly contextRepository: ContextRepository;
    readonly executeScript: ExecuteScript;
    checkCashbackIsActivated: Dispatch;
    constructor(tab: Tab, action: Action, capRepository: CapRepository, contextRepository: ContextRepository, executeScript: ExecuteScript);
    execute(): Promise<true | undefined>;
}
export default PostPurchaseExecuteUI;
