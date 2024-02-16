import { Repository } from '../../../shared/lib/repository';
declare class GetABTestSide {
    readonly storage: Repository;
    constructor(storage: Repository);
    execute(): Promise<string | null>;
}
export default GetABTestSide;
