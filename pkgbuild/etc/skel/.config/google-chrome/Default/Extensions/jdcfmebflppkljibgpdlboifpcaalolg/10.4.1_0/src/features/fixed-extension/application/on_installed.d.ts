import { Tab } from '../../../shared/lib/browser';
declare class OnInstalled {
    readonly tab: Tab;
    constructor(tab: Tab);
    execute(): Promise<void>;
}
export default OnInstalled;
