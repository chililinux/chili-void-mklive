import { MeRepository } from '../domain';
declare class Logout {
    readonly meRepository: MeRepository;
    constructor(meRepository: MeRepository);
    execute(newValue: any, oldValue: any): Promise<void>;
}
export default Logout;
