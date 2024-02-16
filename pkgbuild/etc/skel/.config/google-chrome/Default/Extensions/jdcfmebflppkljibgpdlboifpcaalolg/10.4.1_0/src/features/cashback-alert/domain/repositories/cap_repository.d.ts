export type CapDTO = {
    [key: string]: number;
};
interface CapRepository {
    get(): Promise<CapDTO>;
    save(data: CapDTO): Promise<void>;
    remove(partnerId: number): Promise<void>;
}
export default CapRepository;
