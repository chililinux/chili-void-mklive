declare class ABTest {
    constructor();
    getTestSide(side: string | null): {
        key: string;
        value: string;
    } | null;
}
export default ABTest;
