type Listener = {
    [key: string]: UseCase;
};
export type ListenerMap = {
    [key: string]: UseCase[];
};
type UseCase = {
    useCase: {
        execute: (...args: any) => void;
    };
    keepConnection?: boolean;
};
declare class MessageListenerFactory {
    static createFeatureMessageListener(listener: ListenerMap | Listener): void;
    static createWebPageMessageListener(browser: any, listener: Listener): void;
}
export default MessageListenerFactory;
