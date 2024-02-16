import { Partner } from '../domain';
import { PartnersRepository } from '../infra/repository';
declare class GetByRef {
    readonly repository: PartnersRepository;
    constructor(repository: PartnersRepository);
    execute({ ref }: {
        ref: string;
    }): Promise<Partner>;
}
export default GetByRef;
