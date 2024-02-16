import { CapContextRepository, CapRepository } from '../domain/repositories';
declare class CapActivation {
    readonly capContextRepository: CapContextRepository;
    readonly capRepositories: {
        [key: string]: CapRepository;
    };
    constructor(capContextRepository: CapContextRepository, capRepositories: {
        [key: string]: CapRepository;
    });
    execute({ general }: {
        general?: boolean;
    }): Promise<void>;
}
export default CapActivation;
