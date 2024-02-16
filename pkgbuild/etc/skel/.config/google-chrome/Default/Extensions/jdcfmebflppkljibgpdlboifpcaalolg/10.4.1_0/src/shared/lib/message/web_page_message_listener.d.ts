import MessageListener from './message_listener';
type Listener = {
    request: any;
    sender: any;
    sendResponse: (data?: any) => void;
};
declare class WebPageMessageListener implements MessageListener {
    readonly browser: any;
    readonly greeting: string;
    constructor(browser: any, greeting: string);
    connect(useCase: Function, keepConnection?: boolean): void;
    listen(useCase: Function, { request, sender, sendResponse }: Listener): Promise<void>;
}
export default WebPageMessageListener;
