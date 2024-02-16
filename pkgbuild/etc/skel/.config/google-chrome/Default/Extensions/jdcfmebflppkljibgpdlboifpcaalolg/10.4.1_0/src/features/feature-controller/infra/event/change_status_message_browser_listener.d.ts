import { MessageBrowserListener } from '../../../../shared/lib/event';
declare class ChangeStatusMessageBrowserListener extends MessageBrowserListener {
    constructor(browser: any, useCase: {
        execute: (args: any) => void;
    });
}
export default ChangeStatusMessageBrowserListener;
