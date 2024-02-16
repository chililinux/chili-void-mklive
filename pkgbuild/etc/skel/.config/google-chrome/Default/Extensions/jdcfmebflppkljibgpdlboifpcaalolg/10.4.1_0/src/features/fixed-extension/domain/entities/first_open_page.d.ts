import { FirstPageOpen as FirstPageOpenType } from './configuration';
declare class FirstOpenPage {
    readonly config: FirstPageOpenType;
    constructor(config: FirstPageOpenType);
    isInvalidDomain(url: string): boolean;
}
export default FirstOpenPage;
