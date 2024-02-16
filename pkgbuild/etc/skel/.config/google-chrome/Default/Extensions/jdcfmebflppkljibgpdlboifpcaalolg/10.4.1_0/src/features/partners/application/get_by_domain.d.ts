import { Partner } from '../domain';
import { PartnersRepository } from '../infra/repository';
declare class GetByDomain {
    readonly repository: PartnersRepository;
    constructor(repository: PartnersRepository);
    execute({ domain }: {
        domain: string;
    }): Promise<Partner>;
}
export default GetByDomain;
