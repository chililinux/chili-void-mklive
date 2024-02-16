export { Auth, Request, Customer, Partners, FixedExtension } from '../features';
type AppType = {
    browser: any;
    partnersList: any;
    getGreyPartnersAbcConfiguration: Function;
    storage: any;
};
declare const App: ({ browser, partnersList, getGreyPartnersAbcConfiguration, storage }: AppType) => Promise<void>;
export default App;
