import { CapRepository, CashbackAlertRepository, GeneralCapRepository } from '../domain/repositories';
declare class CapActivation {
    readonly capRepository: CapRepository;
    readonly generalCapRepository: GeneralCapRepository;
    readonly cashbackAlertRepository: CashbackAlertRepository;
    constructor(capRepository: CapRepository, generalCapRepository: GeneralCapRepository, cashbackAlertRepository: CashbackAlertRepository);
    execute({ value, general }: {
        value?: number;
        general?: boolean;
    }): Promise<void>;
}
export default CapActivation;
