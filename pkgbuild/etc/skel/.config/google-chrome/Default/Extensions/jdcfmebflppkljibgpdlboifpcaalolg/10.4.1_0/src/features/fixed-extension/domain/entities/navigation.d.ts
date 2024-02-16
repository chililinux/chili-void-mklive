declare class Navigation {
    back(tab: {
        id: number;
        url: string;
    }, repository?: {
        tab: {
            id: number;
            url: string;
        };
        type: string;
    }): boolean;
}
export default Navigation;
