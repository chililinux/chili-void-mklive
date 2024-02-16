declare class ABTest {
    readonly abTestGroupSide: any;
    constructor(abTestGroupSide: any);
    isActiveInTest(defaultSide?: string): Promise<boolean>;
}
export default ABTest;
