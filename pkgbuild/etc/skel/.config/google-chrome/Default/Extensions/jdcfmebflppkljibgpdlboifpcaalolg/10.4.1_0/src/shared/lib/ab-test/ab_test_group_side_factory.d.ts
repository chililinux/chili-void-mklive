import { Repository } from '../repository';
export interface AbTestGroupSideInterface {
    getId(): Promise<string | number | null>;
    /**
     * Asynchronously retrieves the A/B test group side ('a' or 'b') for the user.
     * @param {string} defaultSide - The default side to be returned if no side is determined.
     * @returns {Promise<string>} - A Promise that resolves with the determined group side ('a' or 'b').
     */
    get(defaultSide: string | null): Promise<string | null>;
}
declare class AbTestGroupSideFactory {
    readonly repository: Repository;
    readonly abTest: boolean[];
    /**
     * Creates an instance of AbTestGroupSideFactory.
     * @param {Repository} repository - An instance of the Repository class used for A/B testing data access.
     * @param {boolean[]} abTest - An array of booleans representing the A/B test groups.
     */
    constructor(repository: Repository, abTest: boolean[]);
    createAbTestByUserId(): AbTestGroupSideInterface;
    createAbTestByExtensionId(): AbTestGroupSideInterface;
}
export default AbTestGroupSideFactory;
