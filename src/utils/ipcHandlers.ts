import { Worker } from 'cluster';
import { db } from 'db/inMemoryDb';
import { IpcRequest, IpcResponse } from 'models/ipc.model';

export const addIpcMessageHandler = (worker: Worker) => {
    worker.on('message', async (request: IpcRequest) => {
        let response: IpcResponse;

        try {
            switch (request.type) {
                case 'FIND_ALL':
                    response = { type: 'FIND_ALL', data: await db.products.findAll() };
                    break;
                case 'FIND_BY_ID':
                    response = { type: 'FIND_BY_ID', data: await db.products.findById(request.id) };
                    break;
                case 'CREATE':
                    response = { type: 'CREATE', data: await db.products.create(request.data) };
                    break;
                case 'UPDATE':
                    response = { type: 'UPDATE', data: await db.products.update(request.id, request.data) };
                    break;
                case 'DELETE':
                    await db.products.delete(request.id);
                    response = { type: 'DELETE', data: undefined };
                    break;
            }

            worker.send(response!);
        } catch (error) {
            console.error('IPC handler error:', error);
        }
    });
};