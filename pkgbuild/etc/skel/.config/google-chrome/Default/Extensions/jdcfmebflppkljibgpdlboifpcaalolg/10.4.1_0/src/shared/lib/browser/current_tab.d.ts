declare class CurrentTab {
    readonly browser: any;
    constructor(browser: any);
    get(): Promise<any>;
}
export default CurrentTab;
