import { HttpClient } from '../../../shared/lib/http';
import { Repository } from '../../../shared/lib/repository';
declare class SendABTest {
    readonly storage: Repository;
    readonly cloudFunctionClient: HttpClient;
    readonly version: string;
    constructor(storage: Repository, cloudFunctionClient: HttpClient, version: string);
    execute({ partnerId }: {
        partnerId: number;
    }): Promise<void>;
}
export default SendABTest;
