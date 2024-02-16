import { Repository } from '../../../../shared/lib/repository';
import { CashbackAlertRepository } from '../../domain/repositories';
import { CashbackAlertDTO } from '../../domain/repositories/cashback_alert_repository';
declare class CashbackAlertStorageRepository implements CashbackAlertRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(): Promise<CashbackAlertDTO>;
    save(data: CashbackAlertDTO): Promise<void>;
    remove(): Promise<void>;
}
export default CashbackAlertStorageRepository;
