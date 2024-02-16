import { FixedExtensionRepository } from '../domain';
declare class GetUIContent {
    readonly repository: FixedExtensionRepository;
    constructor(repository: FixedExtensionRepository);
    execute(): Promise<any>;
}
export default GetUIContent;
