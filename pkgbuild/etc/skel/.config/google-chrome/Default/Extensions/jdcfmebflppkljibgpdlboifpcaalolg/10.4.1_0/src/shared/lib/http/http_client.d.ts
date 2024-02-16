interface HttpClient {
    client: any;
    createHeaders(options?: Options): void;
    get<T>(url: string, authorizeClient?: string[]): Promise<T | undefined>;
    post(url: string, body: any, authorizeClient?: string[]): Promise<any>;
}
export type Options = {
    token?: string;
    userAgent?: string;
};
export default HttpClient;
