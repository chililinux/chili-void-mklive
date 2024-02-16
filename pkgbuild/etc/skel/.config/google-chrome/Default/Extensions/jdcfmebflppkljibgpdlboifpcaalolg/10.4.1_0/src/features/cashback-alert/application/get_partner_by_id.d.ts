import { CashbackAlertRepository } from '../domain/repositories';
declare class GetPartnerById {
    readonly cashbackAlertRepository: CashbackAlertRepository;
    constructor(cashbackAlertRepository: CashbackAlertRepository);
    execute(): Promise<{
        partner: any;
        offer: any;
    }>;
}
export default GetPartnerById;
