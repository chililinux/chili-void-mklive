import { Tab } from '../../../shared/lib/browser';
import { CashbackAlertRepository } from '../domain/repositories';
declare class SavePartnerVisit {
    readonly cashbackAlertRepository: CashbackAlertRepository;
    readonly tab: Tab;
    constructor(cashbackAlertRepository: CashbackAlertRepository, tab: Tab);
    execute({ changeInfo, tab }: {
        changeInfo: any;
        tab: any;
    }): Promise<void>;
}
export default SavePartnerVisit;
