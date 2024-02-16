import { Repository } from '../../../shared/lib/repository';
import { CashbackAlertRepository } from '../domain/repositories';
declare class GetABTestSide {
    readonly cashbackAlertRepository: CashbackAlertRepository;
    readonly storage: Repository;
    constructor(cashbackAlertRepository: CashbackAlertRepository, storage: Repository);
    execute(): Promise<{
        key: string;
        value: string;
    } | null | undefined>;
}
export default GetABTestSide;
