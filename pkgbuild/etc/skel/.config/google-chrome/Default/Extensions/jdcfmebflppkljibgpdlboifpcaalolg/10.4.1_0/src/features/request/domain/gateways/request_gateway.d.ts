export type Params = {
    endpoint: string;
    method: 'get' | 'post';
    queryParams?: string | Record<string, string> | string[][] | URLSearchParams | undefined;
    body?: any;
    authorizedClients?: AuthorizeClients[] | undefined;
};
export type AuthorizeClients = 'bff-extension' | 'customer';
interface RequestGateway {
    get({ endpoint, method, queryParams, authorizedClients }: Params): Promise<any>;
    post({ endpoint, method, body, authorizedClients }: Params): Promise<any>;
}
export default RequestGateway;
