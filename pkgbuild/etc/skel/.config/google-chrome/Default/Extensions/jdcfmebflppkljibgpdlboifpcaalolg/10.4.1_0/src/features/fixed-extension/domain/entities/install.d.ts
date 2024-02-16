import { OnInstalled } from './configuration';
declare class Install {
    readonly config: OnInstalled;
    constructor(config: OnInstalled);
    createURL(browserName: 'Chrome' | 'Firefox' | 'Safari'): string;
    isValidURL(url: string): boolean;
}
export default Install;
