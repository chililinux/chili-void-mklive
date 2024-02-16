import { CardGateway, Card } from '../../domain';
declare class CardHTTPGateway implements CardGateway {
    constructor();
    getStatus(): Promise<Card.Status>;
}
export default CardHTTPGateway;
