import MessageDispatch from './message_dispatch';
declare class WebPageMessageDispatch<T> implements MessageDispatch<T> {
    readonly browser: any;
    readonly eventName: string;
    constructor(browser: any, eventName: string);
    dispatch(data?: any, tabId?: number): any;
}
export default WebPageMessageDispatch;
