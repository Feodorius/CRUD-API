import { IpcRequest, IpcResponse } from 'models/ipc.model';

export const sendToMaster = <T extends IpcResponse>(request: IpcRequest): Promise<T> => {
    return new Promise((resolve) => {
        process.send!(request);

        process.once('message', (response: T) => {
            resolve(response);
        });
    });
};