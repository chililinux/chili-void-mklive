import { Repository } from '../repository';
import { AbTestGroupSideInterface } from './ab_test_group_side_factory';
declare class AbTestByExtensionId implements AbTestGroupSideInterface {
    readonly repository: Repository;
    readonly abTest: boolean[];
    constructor(repository: Repository, abTest: boolean[]);
    getId(): Promise<number | null>;
    get(defaultSide: string | null): Promise<string | null>;
}
export default AbTestByExtensionId;
