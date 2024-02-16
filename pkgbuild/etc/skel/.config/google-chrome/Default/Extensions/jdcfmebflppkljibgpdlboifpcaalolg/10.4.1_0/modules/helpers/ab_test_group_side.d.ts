export = AbTestGroupSide;
declare class AbTestGroupSide {
    /**
     * @param {('userId'|'extensionId')} testBy - Type test Id.
     * @param {Array} abTest - AB test rollout.
     */
    constructor(testBy?: ('userId' | 'extensionId'), abTest?: any[]);
    testBy: "extensionId" | "userId";
    abTest: any[];
    getId(): Promise<any>;
    get(): Promise<"b" | "a" | null>;
}
