import { MessageDispatch } from '../../../shared/lib/message';
import { CashbackAlertRepository } from '../domain/repositories';
declare class HandleInstrumentation {
    readonly cashbackAlertRepository: CashbackAlertRepository;
    sendBigQuery: MessageDispatch<any>;
    sendGA4: MessageDispatch<any>;
    constructor(cashbackAlertRepository: CashbackAlertRepository);
    execute({ event, sendBigQuery, sendGA4, sender, option }: any): Promise<void>;
}
export default HandleInstrumentation;
