import Listener from './listener';
type CustomEventType = CustomEvent<{
    data: any;
    sendResponse?: Function;
    callback?: Function;
}>;
declare class EventListener implements Listener {
    readonly eventName: string;
    constructor(eventName: string);
    connect(useCase: Function): void;
    listen(useCase: Function, event: CustomEventType): Promise<void>;
}
export default EventListener;
