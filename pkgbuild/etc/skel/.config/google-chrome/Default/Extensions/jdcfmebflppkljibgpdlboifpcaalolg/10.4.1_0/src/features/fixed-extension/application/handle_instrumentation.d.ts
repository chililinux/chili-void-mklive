import { MessageDispatch } from '../../../shared/lib/message';
import { FixedExtensionRepository } from '../domain';
declare class HandleInstrumentation {
    readonly repository: FixedExtensionRepository;
    sendBigQuery: MessageDispatch<any>;
    sendGA4: MessageDispatch<any>;
    constructor(repository: FixedExtensionRepository);
    execute({ event, sendBigQuery, sendGA4, sender, option }: any): Promise<void>;
}
export default HandleInstrumentation;
