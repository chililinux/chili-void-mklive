interface TokenGateway {
    get(): Promise<string | void>;
}
export default TokenGateway;
