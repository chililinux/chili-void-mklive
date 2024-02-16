type UTMConfig = {
    source: string;
    medium: string;
    campaign: string;
    term: string;
};
declare class UTM {
    createURL(url: string, config: UTMConfig): string | null;
}
export default UTM;
