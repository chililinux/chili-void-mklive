interface UtmRepository {
    get(): Promise<string>;
    save(context: string): Promise<void>;
    remove(): Promise<void>;
}
export default UtmRepository;
