import { CashbackAlertRepository } from '../domain/repositories';
declare class OpenRedirect {
    readonly cashbackAlertRepository: CashbackAlertRepository;
    constructor(cashbackAlertRepository: CashbackAlertRepository);
    execute({ sender }: any): Promise<void>;
}
export default OpenRedirect;
