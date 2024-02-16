import { FeatureStatusRepository } from '../infra/repository';
declare class CheckInExecutionByTab {
    readonly repository: FeatureStatusRepository;
    constructor(repository: FeatureStatusRepository);
    execute({ tabId, features }: {
        tabId: number;
        features: string[];
    }): Promise<string | true | undefined>;
}
export default CheckInExecutionByTab;
