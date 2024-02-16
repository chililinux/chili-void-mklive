import { MessageBrowserListener } from '../../../../shared/lib/event';
declare class GetPartnerMessageBrowserListener extends MessageBrowserListener {
    constructor(browser: any, useCase: {
        execute: (args: any) => void;
    });
}
export default GetPartnerMessageBrowserListener;
