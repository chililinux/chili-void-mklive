export = asyncFindIndex;
/**
 * Replicates [].findIndex but for async callbacks.
 *
 * @param elements (array) of elements to find the index in
 * @param cb async function callback that resolves a Boolean
 * @see https://gist.github.com/rpgeeganage/61ee4f36a7c6f5d7583d983d0556a720#file-afindindex-ts
 * @see https://medium.com/@geeg/a-possibility-to-use-async-await-for-every-filter-find-findindex-foreach-map-61cd276a155d
 */
declare function asyncFindIndex(elements: any, cb: any): Promise<any>;
