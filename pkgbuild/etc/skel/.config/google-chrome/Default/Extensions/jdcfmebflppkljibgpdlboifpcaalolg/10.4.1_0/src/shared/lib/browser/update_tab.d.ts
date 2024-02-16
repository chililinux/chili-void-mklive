type TabOptions = {
    url?: string;
    active?: boolean;
    highlighted?: number;
    pinned?: boolean;
    index?: number;
};
declare class UpdateTab {
    readonly browser: any;
    constructor(browser: any);
    execute(tabId: number, tabOptions?: TabOptions): void;
}
export default UpdateTab;
