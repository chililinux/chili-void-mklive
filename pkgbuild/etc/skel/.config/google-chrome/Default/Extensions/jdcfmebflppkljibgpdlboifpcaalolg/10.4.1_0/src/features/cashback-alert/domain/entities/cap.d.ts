declare class Cap {
    readonly value: number;
    constructor(value?: number);
    create(partnerId: number, value?: number): {
        [x: number]: number;
    };
    createGeneral(value?: number): number;
    isExpired(): boolean;
    expiresIn(value?: number): number;
}
export default Cap;
