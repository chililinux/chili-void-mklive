import { Card } from '../entities';
interface CardRepository {
    get(): Promise<Card.Status>;
    save(status: Card.Status): Promise<void>;
    remove(): Promise<void>;
}
export default CardRepository;
