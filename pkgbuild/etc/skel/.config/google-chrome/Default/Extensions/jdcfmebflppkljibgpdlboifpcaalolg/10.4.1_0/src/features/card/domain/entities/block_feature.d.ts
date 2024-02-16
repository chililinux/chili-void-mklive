declare class BlockFeature {
    isBlocked(featuresInExecution: {
        [key: string]: boolean;
    } | undefined, blockedByFeatures: string[]): string | true | undefined;
}
export default BlockFeature;
