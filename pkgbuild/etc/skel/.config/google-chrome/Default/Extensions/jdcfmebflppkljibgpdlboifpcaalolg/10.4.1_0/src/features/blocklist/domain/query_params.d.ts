import { TabType } from "./tab";
import Configuration from "./configuration";
declare class QueryParams {
    readonly tab: TabType;
    readonly browser: any;
    readonly configuration: Configuration;
    constructor(tab: TabType, browser: any, configuration: Configuration);
    isValid(): boolean;
}
export default QueryParams;
