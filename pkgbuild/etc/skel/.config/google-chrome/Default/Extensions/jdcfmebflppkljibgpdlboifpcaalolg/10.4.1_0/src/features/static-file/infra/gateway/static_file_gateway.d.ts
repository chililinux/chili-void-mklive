interface StaticFileGateway {
    get: (path: string) => Promise<JSON | undefined>;
}
export default StaticFileGateway;
