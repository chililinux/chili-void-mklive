import MessageListener from './message_listener';
type CustomEventType = CustomEvent<{
    data: any;
    sendResponse?: Function;
    callback?: Function;
}>;
declare class FeatureMessageListener implements MessageListener {
    readonly eventName: string;
    constructor(eventName: string);
    connect(useCase: Function): void;
    listen(useCase: Function, event: CustomEventType): Promise<void>;
}
export default FeatureMessageListener;
