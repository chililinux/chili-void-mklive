import { MessageBrowserListener } from '../../../../shared/lib/event';
declare class GetConfigMessageBrowserListener extends MessageBrowserListener {
    constructor(browser: any, useCase: {
        execute: (args: any) => void;
    });
}
export default GetConfigMessageBrowserListener;
