import FeatureMessageDispatch from './feature_message_dispatch';
import WebPageMessageDispatch from './web_page_message_dispatch';
declare class MessageDispatchFactory {
    static createFeatureMessageDispatch(listener: string[]): {
        [eventName: string]: FeatureMessageDispatch<any>;
    };
    static createWebPageMessageDispatch(browser: any, listener: string[]): {
        [greeting: string]: WebPageMessageDispatch<any>;
    };
}
export default MessageDispatchFactory;
