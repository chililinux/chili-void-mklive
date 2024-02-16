import Listener from './listener';
declare class OnInstalledBrowserListener implements Listener {
    readonly browser: any;
    constructor(browser: any);
    connect(useCase: Function | Function[]): void;
    listen(useCase: Function): Promise<void>;
}
export default OnInstalledBrowserListener;
