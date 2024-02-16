import Listener from './listener';
declare class TabClosedBrowserListener implements Listener {
    readonly browser: any;
    constructor(browser: any);
    connect(useCase: Function): void;
    listen(useCase: Function, tabId: number, removeInfo: any): Promise<void>;
}
export default TabClosedBrowserListener;
