import { Context } from "../entities";
interface CapRepository {
    context: Context;
    get(): Promise<any>;
    save({ cap, tab }: {
        cap: number;
        tab: {
            id: number;
            url: string;
        };
        type: string;
    }): Promise<void>;
    remove(): Promise<void>;
}
export default CapRepository;
