declare class Action {
    readonly browser: any;
    action: any;
    constructor(browser: any);
    isPinned(): Promise<any>;
}
export default Action;
