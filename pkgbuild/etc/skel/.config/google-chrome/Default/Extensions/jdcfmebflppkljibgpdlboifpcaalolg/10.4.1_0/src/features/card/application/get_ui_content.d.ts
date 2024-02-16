import { CardRepository } from '../domain';
declare class GetUIContent {
    readonly repository: CardRepository;
    constructor(repository: CardRepository);
    execute(): Promise<any>;
}
export default GetUIContent;
