import Listener from './listener';
declare class TabUpdatedBrowserListener implements Listener {
    readonly browser: any;
    constructor(browser: any);
    connect(useCase: Function | Function[]): void;
    listen(useCase: Function, changeInfo: any, tab: any): Promise<void>;
}
export default TabUpdatedBrowserListener;
