declare class Partner {
    readonly id: number;
    constructor(id: number);
    isOfFeature(partners: {
        [key: string]: string;
    }): boolean;
}
export default Partner;
