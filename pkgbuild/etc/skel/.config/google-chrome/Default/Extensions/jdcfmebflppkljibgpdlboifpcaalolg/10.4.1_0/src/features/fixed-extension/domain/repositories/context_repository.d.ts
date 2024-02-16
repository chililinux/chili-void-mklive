import { Context } from "../entities";
interface ContextRepository {
    get(): Promise<string>;
    save(context: Context): Promise<void>;
    remove(): Promise<void>;
}
export default ContextRepository;
