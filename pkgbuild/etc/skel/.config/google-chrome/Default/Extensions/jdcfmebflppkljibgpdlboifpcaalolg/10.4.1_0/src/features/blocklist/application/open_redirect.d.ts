import { Dispatch } from '../../../shared/lib/event';
declare class OpenRedirect {
    openRedirect: Dispatch;
    sendGA4: Dispatch;
    constructor();
    execute(args: any): Promise<void>;
}
export default OpenRedirect;
