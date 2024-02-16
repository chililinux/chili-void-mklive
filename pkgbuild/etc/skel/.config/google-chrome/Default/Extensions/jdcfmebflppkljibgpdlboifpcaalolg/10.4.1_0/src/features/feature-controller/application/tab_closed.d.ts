import { FeatureStatusRepository, SubscribeRepository, TabRepository } from '../infra/repository';
declare class TabClosed {
    readonly featureStatusRepository: FeatureStatusRepository;
    readonly tabRepository: TabRepository;
    readonly subscribeRepository: SubscribeRepository;
    constructor(featureStatusRepository: FeatureStatusRepository, tabRepository: TabRepository, subscribeRepository: SubscribeRepository);
    execute({ tabId }: {
        tabId: number;
    }): Promise<void>;
}
export default TabClosed;
