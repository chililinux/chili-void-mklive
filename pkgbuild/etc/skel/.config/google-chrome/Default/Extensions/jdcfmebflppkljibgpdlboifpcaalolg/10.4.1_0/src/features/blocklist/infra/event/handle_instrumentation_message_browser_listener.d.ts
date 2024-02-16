import { MessageBrowserListener } from '../../../../shared/lib/event';
declare class HandleInstrumentationMessageBrowserListener extends MessageBrowserListener {
    constructor(browser: any, useCase: {
        execute: (args: any) => void;
    });
}
export default HandleInstrumentationMessageBrowserListener;
