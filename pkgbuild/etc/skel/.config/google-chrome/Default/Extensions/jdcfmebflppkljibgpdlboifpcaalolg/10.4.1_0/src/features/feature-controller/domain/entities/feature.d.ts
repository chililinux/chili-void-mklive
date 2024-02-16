declare class Feature {
    checkInExecution(featuresInExecution: {
        [key: string]: boolean;
    } | undefined, featuresForCheck: string[]): string | true | undefined;
}
export default Feature;
