interface FixedExtensionRepository {
    get: (key?: string) => Promise<any>;
    save: (data: any, expiresIn?: number) => Promise<void>;
}
export default FixedExtensionRepository;
