import { FeatureStatusRepository, SubscribeRepository } from '../infra/repository';
type Input = {
    request: {
        data: {
            feature: string;
            status: boolean;
        };
    };
    sender: {
        tab: {
            id: number;
            url?: string;
            pendingUrl?: string;
        };
    };
};
declare class ChangeStatus {
    readonly featureStatusRepository: FeatureStatusRepository;
    readonly subscribeRepository: SubscribeRepository;
    constructor(featureStatusRepository: FeatureStatusRepository, subscribeRepository: SubscribeRepository);
    execute(data: Input): Promise<void>;
}
export default ChangeStatus;
