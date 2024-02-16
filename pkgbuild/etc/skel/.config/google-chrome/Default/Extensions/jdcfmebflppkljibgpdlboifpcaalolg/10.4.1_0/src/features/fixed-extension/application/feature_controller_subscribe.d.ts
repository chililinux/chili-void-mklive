import { Tab } from '../../../shared/lib/browser';
type Context = {
    contextName: 'firstPageOpen' | 'postPurchase';
    useCase: (params?: any) => Promise<any>;
};
declare class FeatureControllerSubscribe {
    readonly tab: Tab;
    readonly contexts: Context[];
    constructor(tab: Tab, contexts: Context[]);
    execute({ tab, changeInfo }: any): Promise<void>;
}
export default FeatureControllerSubscribe;
