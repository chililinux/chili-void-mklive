interface MessageDispatch<T> {
    dispatch(data?: any): Promise<T>;
}
export default MessageDispatch;
