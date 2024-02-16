export type TabType = {
    url: string;
    pendingUrl?: string;
    status: 'loading' | 'complete';
    id: number;
};
export type ChangeInfoType = {
    favIconUrl?: string;
    title?: string;
};
declare class Tab {
    readonly tab?: TabType | undefined;
    readonly changeInfo?: ChangeInfoType | undefined;
    constructor(tab?: TabType | undefined, changeInfo?: ChangeInfoType | undefined);
    isValid(): boolean;
    isValidChangeInfo(): boolean;
}
export default Tab;
