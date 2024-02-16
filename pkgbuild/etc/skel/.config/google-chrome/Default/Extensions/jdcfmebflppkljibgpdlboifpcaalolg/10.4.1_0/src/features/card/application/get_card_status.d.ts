import { Card, CardGateway, CardRepository } from '../domain';
declare class GetCardStatus {
    readonly gateway: CardGateway;
    readonly repository: CardRepository;
    constructor(gateway: CardGateway, repository: CardRepository);
    execute(): Promise<Card.Status>;
}
export default GetCardStatus;
