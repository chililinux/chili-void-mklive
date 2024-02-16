import { EventListener } from '../../../../shared/lib/event';
declare class ChangeStatusEventListener extends EventListener {
    constructor(useCase: {
        execute: (args: any) => void;
    });
}
export default ChangeStatusEventListener;
