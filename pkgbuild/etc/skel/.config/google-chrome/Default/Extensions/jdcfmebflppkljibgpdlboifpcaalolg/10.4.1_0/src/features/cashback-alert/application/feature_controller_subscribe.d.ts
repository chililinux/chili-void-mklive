import { Tab } from '../../../shared/lib/browser';
type UseCase = () => Promise<any>;
declare class FeatureControllerSubscribe {
    readonly tab: Tab;
    readonly useCase: UseCase;
    constructor(tab: Tab, useCase: UseCase);
    execute({ tab, changeInfo }: {
        tab: any;
        changeInfo: any;
    }): Promise<void>;
}
export default FeatureControllerSubscribe;
