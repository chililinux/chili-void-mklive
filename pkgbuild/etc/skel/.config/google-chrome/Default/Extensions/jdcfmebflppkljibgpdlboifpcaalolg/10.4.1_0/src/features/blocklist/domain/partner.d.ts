declare class Partner {
    readonly blacklist: number[];
    constructor(blacklist: number[]);
    inFeature(partnerId: number): boolean;
}
export default Partner;
