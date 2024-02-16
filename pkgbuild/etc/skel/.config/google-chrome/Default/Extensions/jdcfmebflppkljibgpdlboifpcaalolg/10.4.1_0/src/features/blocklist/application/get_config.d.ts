declare class GetConfig {
    readonly config: any;
    constructor(config: any);
    execute(): Promise<any>;
}
export default GetConfig;
