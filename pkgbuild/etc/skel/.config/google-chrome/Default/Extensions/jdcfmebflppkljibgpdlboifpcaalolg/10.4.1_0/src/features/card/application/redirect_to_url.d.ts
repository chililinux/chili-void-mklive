import { Tab } from '../../../shared/lib/browser';
import { UtmRepository } from '../domain';
declare class RedirectToURL {
    readonly utmRepository: UtmRepository;
    readonly tab: Tab;
    constructor(utmRepository: UtmRepository, tab: Tab);
    execute({ sender }: any): Promise<void>;
}
export default RedirectToURL;
