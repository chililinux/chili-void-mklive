interface TokenRepository {
    save(token: string): Promise<void>;
    get(): Promise<string>;
    remove(): Promise<void>;
}
export default TokenRepository;
