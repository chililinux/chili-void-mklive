import { AxiosInstance } from 'axios';
import HttpClient, { Options } from './http_client';
declare class AxiosAdapter implements HttpClient {
    client: AxiosInstance;
    constructor(baseURL: string, options?: Options);
    createHeaders(options: Options): void;
    get(url: string, authorizeClient: string[]): Promise<any>;
    post(url: string, body: any, authorizeClient: string[]): Promise<any>;
}
export default AxiosAdapter;
