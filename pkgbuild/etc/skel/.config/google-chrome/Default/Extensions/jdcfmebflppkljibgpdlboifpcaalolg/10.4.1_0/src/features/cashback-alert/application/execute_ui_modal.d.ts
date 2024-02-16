import { CurrentTab, ExecuteScript } from '../../../shared/lib/browser';
import { CapRepository, CashbackAlertRepository, GeneralCapRepository } from '../domain/repositories';
declare class ExecuteUIModal {
    readonly cashbackAlertRepository: CashbackAlertRepository;
    readonly capRepository: CapRepository;
    readonly generalCapRepository: GeneralCapRepository;
    readonly currentTab: CurrentTab;
    readonly executeScript: ExecuteScript;
    constructor(cashbackAlertRepository: CashbackAlertRepository, capRepository: CapRepository, generalCapRepository: GeneralCapRepository, currentTab: CurrentTab, executeScript: ExecuteScript);
    execute(): Promise<true | undefined>;
}
export default ExecuteUIModal;
