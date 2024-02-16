import { EventListener } from '../../../../shared/lib/event';
declare class GetInExecutionEventListener extends EventListener {
    constructor(useCase: {
        execute: ({ tabId }: {
            tabId?: number;
        }) => void;
    });
}
export default GetInExecutionEventListener;
