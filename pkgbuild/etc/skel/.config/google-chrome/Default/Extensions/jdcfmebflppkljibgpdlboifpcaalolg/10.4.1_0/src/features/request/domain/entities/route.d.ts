type CachedRoute = {
    endpoint: string;
    method: string;
    minutes: number;
};
declare class Route {
    readonly routes: CachedRoute[];
    constructor(routes: CachedRoute[]);
    checkIsCached(endpoint: string): CachedRoute | undefined;
}
export default Route;
