declare class SearchEngine {
    readonly configuration: {
        [key: string]: string[];
    };
    constructor(configuration: {
        [key: string]: string[];
    });
    isSearchEngine(url: string): boolean;
    isValidQueryparam(url: string): boolean;
}
export default SearchEngine;
