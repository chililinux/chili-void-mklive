type PartnerType = {
    id: number;
    domain: string;
    ref: string;
};
declare class Partner {
    readonly partners: {
        [domain: string]: PartnerType;
    };
    constructor(partners?: {
        [domain: string]: PartnerType;
    });
    getByDomain(domain: string): Partner;
    getById(id: number): Partner;
    getByRef(ref: string): Partner;
    removeById(list: PartnerType[], ids: number[]): any[];
}
export default Partner;
