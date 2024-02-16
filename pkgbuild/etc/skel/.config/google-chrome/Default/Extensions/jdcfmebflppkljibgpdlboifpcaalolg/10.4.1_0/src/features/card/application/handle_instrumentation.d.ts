import { MessageDispatch } from '../../../shared/lib/message';
import { CardRepository, UtmRepository } from '../domain/repositories';
declare class HandleInstrumentation {
    readonly utmRepository: UtmRepository;
    readonly cardRepository: CardRepository;
    sendBigQuery: MessageDispatch<any>;
    sendGA4: MessageDispatch<any>;
    constructor(utmRepository: UtmRepository, cardRepository: CardRepository);
    execute({ event, sendBigQuery, sendGA4, sender, option }: any): Promise<void>;
}
export default HandleInstrumentation;
