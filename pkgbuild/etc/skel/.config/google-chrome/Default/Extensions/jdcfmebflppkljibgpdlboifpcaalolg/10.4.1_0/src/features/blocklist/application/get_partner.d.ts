import { Dispatch } from '../../../shared/lib/event';
declare class GetPartner {
    getPartnerByRef: Dispatch;
    constructor();
    execute(args: any): Promise<any>;
}
export default GetPartner;
