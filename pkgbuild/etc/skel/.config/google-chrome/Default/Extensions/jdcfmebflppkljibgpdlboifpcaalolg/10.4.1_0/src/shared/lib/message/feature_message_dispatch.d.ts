import MessageDispatch from './message_dispatch';
declare class FeatureMessageDispatch<T> implements MessageDispatch<T> {
    readonly eventName: string;
    constructor(eventName: string);
    dispatch(data?: any): Promise<T>;
}
export default FeatureMessageDispatch;
