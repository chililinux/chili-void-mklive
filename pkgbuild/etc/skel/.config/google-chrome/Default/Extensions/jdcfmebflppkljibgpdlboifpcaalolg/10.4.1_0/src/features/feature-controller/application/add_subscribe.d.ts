import { SubscribeRepository } from '../infra/repository';
declare class AddSubscribe {
    readonly repository: SubscribeRepository;
    constructor(repository: SubscribeRepository);
    execute(data: any): Promise<void>;
}
export default AddSubscribe;
