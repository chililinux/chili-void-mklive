import Configuration from './configuration';
declare class Cap {
    readonly context: CapContext;
    readonly config: Configuration;
    constructor(context: CapContext, config: Configuration);
    create(): {
        [x: string]: number;
    };
    isActivated(expiresIn: number): boolean;
}
export type CapContext = 'onNavigation' | 'googleSearch' | 'postPurchase' | 'general';
export default Cap;
