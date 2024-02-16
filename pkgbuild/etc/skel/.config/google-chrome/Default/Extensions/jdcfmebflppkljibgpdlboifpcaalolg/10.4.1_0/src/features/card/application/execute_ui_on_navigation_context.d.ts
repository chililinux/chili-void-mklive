import { Tab, ExecuteScript } from '../../../shared/lib/browser';
import { CapContextRepository, CapRepository, CapUrlRepository, UtmRepository } from '../domain';
declare class ExecuteUIOnNavigationContext {
    readonly capRepository: CapRepository;
    readonly capContextRepository: CapContextRepository;
    readonly capUrlRepository: CapUrlRepository;
    readonly utmRepository: UtmRepository;
    readonly tab: Tab;
    readonly executeScript: ExecuteScript;
    constructor(capRepository: CapRepository, capContextRepository: CapContextRepository, capUrlRepository: CapUrlRepository, utmRepository: UtmRepository, tab: Tab, executeScript: ExecuteScript);
    execute(): Promise<true | undefined>;
}
export default ExecuteUIOnNavigationContext;
