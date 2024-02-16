import { Dispatch } from '../../../shared/lib/event';
declare class HandleInstrumentation {
    sendBigQuery: Dispatch;
    sendGA4: Dispatch;
    getPartnerByRef: Dispatch;
    constructor();
    execute(args: any): Promise<void>;
}
export default HandleInstrumentation;
