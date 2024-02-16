import { CapContext } from "../entities/cap";
interface CapContextRepository {
    get(): Promise<string>;
    save(context: CapContext): Promise<void>;
    remove(): Promise<void>;
}
export default CapContextRepository;
