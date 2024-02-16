declare class CashbackAlert {
    readonly value: number;
    constructor(value?: number);
    create(partnerId: number, limit?: number): {
        partnerId: number;
        expiresIn: number;
    };
    isExpired(): boolean;
    expiresIn(limit?: number): number;
}
export default CashbackAlert;
