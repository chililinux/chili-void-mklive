type TabOptions = {
    active?: boolean;
    index?: number;
    pinned?: boolean;
};
declare class CreateTab {
    readonly browser: any;
    constructor(browser: any);
    create(url: string, tabOptions?: TabOptions): void;
}
export default CreateTab;
