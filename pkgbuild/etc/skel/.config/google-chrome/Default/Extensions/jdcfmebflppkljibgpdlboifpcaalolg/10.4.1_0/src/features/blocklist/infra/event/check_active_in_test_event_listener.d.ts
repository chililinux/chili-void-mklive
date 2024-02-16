import { EventListener } from '../../../../shared/lib/event';
declare class CheckActiveInTestEventListener extends EventListener {
    constructor(useCase: {
        execute: (args: any) => void;
    });
}
export default CheckActiveInTestEventListener;
