import { Card } from '../entities';
interface CardGateway {
    getStatus(): Promise<Card.Status>;
}
export default CardGateway;
