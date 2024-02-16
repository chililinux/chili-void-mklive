declare function buildAndSendMessage({ hitType, eventCategory, eventAction, eventLabel, eventValue, documentHostname, page, title }?: {
    eventCategory: null;
    eventAction: null;
    eventLabel: null;
    eventValue: null;
    documentHostname: null;
    page: null;
    title: null;
    hitType: any;
}): Promise<void>;
export function handleSendMessageAnalytic({ message }: {
    message: any;
}): void;
export { buildAndSendMessage as ga };
