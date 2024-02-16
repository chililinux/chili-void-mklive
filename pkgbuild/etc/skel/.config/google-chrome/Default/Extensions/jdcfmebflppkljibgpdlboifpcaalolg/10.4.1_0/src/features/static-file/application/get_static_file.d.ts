import { Dispatch } from '../../../shared/lib/event';
import { StaticFileGateway } from '../infra/gateway';
import { StaticFileRepository } from '../infra/repository';
declare class GetStaticFile {
    readonly httpGateway: StaticFileGateway;
    readonly repository: StaticFileRepository;
    readonly configEventDispatch: Dispatch;
    constructor(httpGateway: StaticFileGateway, repository: StaticFileRepository, configEventDispatch: Dispatch);
    execute({ key, fileURL }: {
        key: string;
        fileURL: string;
    }): Promise<JSON | undefined>;
}
export default GetStaticFile;
