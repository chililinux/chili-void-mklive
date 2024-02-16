import { EventListener } from '../../../../shared/lib/event';
declare class OpenRedirectEventListener extends EventListener {
    constructor(useCase: {
        execute: (args: any) => void;
    });
}
export default OpenRedirectEventListener;
