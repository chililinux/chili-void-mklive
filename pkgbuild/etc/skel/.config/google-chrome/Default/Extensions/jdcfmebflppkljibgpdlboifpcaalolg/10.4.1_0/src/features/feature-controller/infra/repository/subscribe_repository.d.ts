import { Subscribe } from '../../domain';
interface SubscribeRepository {
    save(data: {
        [x: string]: Subscribe;
    }): Promise<void>;
    get(name: string): Promise<string[]>;
    getAll(): Promise<{
        [x: string]: Subscribe;
    }>;
    remove(name: string): Promise<void>;
}
export default SubscribeRepository;
