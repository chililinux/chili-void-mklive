export type CashbackAlertDTO = {
    partnerId: number;
    expiresIn: number;
};
interface CashbackAlertRepository {
    get(): Promise<CashbackAlertDTO>;
    save(cashbackAlert: CashbackAlertDTO): Promise<void>;
    remove(): Promise<void>;
}
export default CashbackAlertRepository;
