import Listener from './listener';
type Listen = {
    request: any;
    sender: any;
    sendResponse?: (data?: any) => void;
};
declare class MessageBrowserListener implements Listener {
    readonly browser: any;
    readonly greeting: string;
    constructor(browser: any, greeting: string);
    connect(useCase: Function, keepConnection?: boolean): void;
    listen(useCase: Function, { request, sender, sendResponse }: Listen): Promise<void>;
}
export default MessageBrowserListener;
