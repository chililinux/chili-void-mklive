import { Tab } from '../../../shared/lib/browser';
import { FeatureStatusRepository, TabRepository } from '../infra/repository';
declare class TabUpdated {
    readonly featureStatusRepository: FeatureStatusRepository;
    readonly tabRepository: TabRepository;
    readonly tab: Tab;
    constructor(featureStatusRepository: FeatureStatusRepository, tabRepository: TabRepository, tab: Tab);
    execute({ changeInfo, tab }: any): Promise<void>;
}
export default TabUpdated;
