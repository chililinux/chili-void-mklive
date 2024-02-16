import { FeatureStatusRepository } from '../infra/repository';
declare class GetInExecution {
    readonly repository: FeatureStatusRepository;
    constructor(repository: FeatureStatusRepository);
    execute({ tabId }: {
        tabId?: number;
    }): Promise<any>;
}
export default GetInExecution;
