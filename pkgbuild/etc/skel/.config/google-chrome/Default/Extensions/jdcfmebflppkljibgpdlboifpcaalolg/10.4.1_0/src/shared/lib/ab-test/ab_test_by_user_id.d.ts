import { Repository } from '../repository';
import { AbTestGroupSideInterface } from './ab_test_group_side_factory';
declare class AbTestByUserId implements AbTestGroupSideInterface {
    readonly repository: Repository;
    readonly abTest: boolean[];
    constructor(repository: Repository, abTest: boolean[]);
    getId(): Promise<string>;
    get(defaultSide: string | null): Promise<string | null>;
}
export default AbTestByUserId;
