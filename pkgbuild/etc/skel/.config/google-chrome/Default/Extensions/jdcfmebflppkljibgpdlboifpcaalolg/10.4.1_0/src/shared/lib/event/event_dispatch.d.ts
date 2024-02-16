import Dispatch from './dispatch';
declare class EventDispatch<T> implements Dispatch {
    readonly eventName: string;
    constructor(eventName: string);
    dispatch(data?: any): Promise<T>;
}
export default EventDispatch;
