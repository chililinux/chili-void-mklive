interface GeneralCapRepository {
    get(): Promise<number>;
    save(data: number): Promise<void>;
    remove(): Promise<void>;
}
export default GeneralCapRepository;
