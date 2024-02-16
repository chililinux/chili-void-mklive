declare class ExecuteScript {
    readonly browser: any;
    constructor(browser: any);
    execute({ tabId, file }: {
        tabId: number;
        file: string;
    }): void;
}
export default ExecuteScript;
