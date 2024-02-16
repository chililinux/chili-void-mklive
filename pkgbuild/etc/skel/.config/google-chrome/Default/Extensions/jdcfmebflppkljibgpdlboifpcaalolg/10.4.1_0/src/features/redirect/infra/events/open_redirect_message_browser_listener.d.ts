import { MessageBrowserListener } from '../../../../shared/lib/event';
declare class OpenRedirectMessageBrowserListener extends MessageBrowserListener {
    constructor(browser: any, useCase: {
        execute: (args: any) => void;
    });
}
export default OpenRedirectMessageBrowserListener;
