import { Partner } from '../domain';
import { PartnersRepository } from '../infra/repository';
declare class GetById {
    private repository;
    constructor(repository: PartnersRepository);
    execute({ id }: {
        id: number;
    }): Promise<Partner>;
}
export default GetById;
