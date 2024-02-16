interface CapUrlRepository {
    get(url: string): Promise<number>;
    save(expiresIn: number, url: string): Promise<void>;
    remove(url: string): Promise<void>;
}
export default CapUrlRepository;
