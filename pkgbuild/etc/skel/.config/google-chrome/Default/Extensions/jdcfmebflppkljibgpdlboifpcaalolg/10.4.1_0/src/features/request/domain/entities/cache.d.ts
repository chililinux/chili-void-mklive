declare class Cache {
    isExpired(expiresIn: number): boolean;
    create(minutes: number): number;
}
export default Cache;
