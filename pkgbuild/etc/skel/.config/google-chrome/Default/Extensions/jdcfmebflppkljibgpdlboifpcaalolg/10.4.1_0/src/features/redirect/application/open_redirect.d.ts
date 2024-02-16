import { CreateTab } from '../../../shared/lib/browser';
import { Dispatch } from '../../../shared/lib/event';
type ExecuteParams = {
    partnerId: {};
    tabOptions?: {};
    additionalParams?: {
        [key: string]: string;
    };
};
declare class OpenRedirect {
    readonly getPartnerById: Dispatch;
    readonly createTab: CreateTab;
    readonly browserName: string;
    readonly extId: string;
    readonly extVersion: string;
    constructor(getPartnerById: Dispatch, createTab: CreateTab, browserName: string, extId: string, extVersion: string);
    execute({ partnerId, tabOptions, additionalParams }: ExecuteParams): Promise<void>;
}
export default OpenRedirect;
