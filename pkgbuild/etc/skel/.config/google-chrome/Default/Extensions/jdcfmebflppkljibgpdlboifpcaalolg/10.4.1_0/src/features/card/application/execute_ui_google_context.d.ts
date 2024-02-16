import { Tab, ExecuteScript } from '../../../shared/lib/browser';
import { CapRepository, UtmRepository, CapContextRepository, CapUrlRepository } from '../domain';
declare class ExecuteUIGoogleContext {
    readonly capRepository: CapRepository;
    readonly capContextRepository: CapContextRepository;
    readonly capUrlRepository: CapUrlRepository;
    readonly utmRepository: UtmRepository;
    readonly tab: Tab;
    readonly executeScript: ExecuteScript;
    constructor(capRepository: CapRepository, capContextRepository: CapContextRepository, capUrlRepository: CapUrlRepository, utmRepository: UtmRepository, tab: Tab, executeScript: ExecuteScript);
    execute(): Promise<true | undefined>;
}
export default ExecuteUIGoogleContext;
