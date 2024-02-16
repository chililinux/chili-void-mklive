import { CapContext } from '../entities/cap';
interface CapRepository {
    context: CapContext;
    get(): Promise<number>;
    save(expiresIn: number): Promise<void>;
    remove(): Promise<void>;
}
export default CapRepository;
