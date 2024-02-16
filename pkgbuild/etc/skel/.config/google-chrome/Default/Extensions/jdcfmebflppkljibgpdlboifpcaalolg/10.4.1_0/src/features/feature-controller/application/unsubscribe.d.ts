import { SubscribeRepository } from '../infra/repository';
declare class Unsubscribe {
    readonly repository: SubscribeRepository;
    constructor(repository: SubscribeRepository);
    execute({ name }: {
        name: string;
    }): Promise<void>;
}
export default Unsubscribe;
