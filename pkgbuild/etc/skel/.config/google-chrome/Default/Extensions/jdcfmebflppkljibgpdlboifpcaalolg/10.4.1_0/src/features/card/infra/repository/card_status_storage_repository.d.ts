import { Repository } from '../../../../shared/lib/repository';
import { Card } from '../../domain';
import { CardRepository } from '../../domain/repositories';
declare class CardStatusStorageRepository implements CardRepository {
    readonly repository: Repository;
    KEY: string;
    constructor(repository: Repository);
    get(): Promise<Card.Status>;
    save(status: Card.Status): Promise<void>;
    remove(): Promise<void>;
}
export default CardStatusStorageRepository;
