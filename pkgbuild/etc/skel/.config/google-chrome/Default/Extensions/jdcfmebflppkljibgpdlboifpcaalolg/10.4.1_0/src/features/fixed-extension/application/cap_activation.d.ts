import { Tab } from '../../../shared/lib/browser';
import { ContextRepository, CapRepository } from '../domain/repositories';
declare class CapActivation {
    readonly tab: Tab;
    readonly contextRepository: ContextRepository;
    readonly capRepositories: {
        [key: string]: CapRepository;
    };
    constructor(tab: Tab, contextRepository: ContextRepository, capRepositories: {
        [key: string]: CapRepository;
    });
    execute({ value, event }: {
        value?: number;
        event?: 'view' | 'close';
    }): Promise<void>;
}
export default CapActivation;
