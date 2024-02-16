declare class BlockDomain {
    readonly domain: string;
    constructor(domain: string);
    isBlocked(domains: string[]): boolean;
}
export default BlockDomain;
