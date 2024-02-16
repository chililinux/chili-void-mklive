interface Listener {
    listen(useCase: Function, ...args: any): void;
    connect(useCase: Function): void;
}
export default Listener;
