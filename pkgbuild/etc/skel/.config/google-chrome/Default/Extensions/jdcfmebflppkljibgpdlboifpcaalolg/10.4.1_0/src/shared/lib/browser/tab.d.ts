type Status = 'loading' | 'complete';
type ChangeInfo = {
    [key: string]: boolean | string;
};
type TabOptions = {
    url?: string;
    active?: boolean;
    highlighted?: number;
    pinned?: boolean;
    index?: number;
};
declare class Tab {
    readonly browser: any;
    constructor(browser: any);
    create(url: string, tabOptions?: TabOptions): void;
    update(tabId: number, tabOptions?: TabOptions): void;
    get(): Promise<any>;
    isValidStatus(changeInfo: ChangeInfo, status: Status): boolean;
}
export default Tab;
