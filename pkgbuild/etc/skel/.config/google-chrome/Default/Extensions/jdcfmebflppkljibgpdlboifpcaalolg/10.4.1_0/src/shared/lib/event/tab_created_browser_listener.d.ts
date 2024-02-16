import Listener from './listener';
declare class TabCreatedBrowserListener implements Listener {
    readonly browser: any;
    constructor(browser: any);
    connect(useCase: Function): void;
    listen(useCase: Function, tab: any): Promise<void>;
}
export default TabCreatedBrowserListener;
