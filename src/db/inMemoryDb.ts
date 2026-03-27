import { IpcResponse } from 'models/ipc.model';
import { DbProducts, Product } from 'models/product.model';
import { sendToMaster } from 'utils/ipcWorker';

let products: Product[] = [];
const isWorker = !!process.env.WORKER_PORT;

const primaryDb = {
    findAll: (): Product[] => products,
    findById: (id: string): Product | undefined => products.find((product) => product.id === id),

    create: (product: Product): Product => {
        products.push(product);
        return product;
    },

    update: (id: string, data: Omit<Product, 'id'>): Product => {
        const index = products.findIndex((product) => product.id === id);
        const updated = { id, ...data };
        products[index] = updated;
        return updated;
    },

    delete: (id: string): void => {
        products = products.filter((product) => product.id !== id);
    },
};

const workerDb = {
    findAll: (): Promise<Product[]> =>
        sendToMaster<Extract<IpcResponse, { type: 'FIND_ALL' }>>({ type: 'FIND_ALL' })
            .then((response) => response.data),

    findById: (id: string): Promise<Product | undefined> =>
        sendToMaster<Extract<IpcResponse, { type: 'FIND_BY_ID' }>>({ type: 'FIND_BY_ID', id })
            .then((response) => response.data),

    create: (product: Product): Promise<Product> =>
        sendToMaster<Extract<IpcResponse, { type: 'CREATE' }>>({ type: 'CREATE', data: product })
            .then((response) => response.data),

    update: (id: string, data: Omit<Product, 'id'>): Promise<Product> =>
        sendToMaster<Extract<IpcResponse, { type: 'UPDATE' }>>({ type: 'UPDATE', id, data })
            .then((response) => response.data),

    delete: (id: string): Promise<void> =>
        sendToMaster<Extract<IpcResponse, { type: 'DELETE' }>>({ type: 'DELETE', id })
            .then(() => undefined),
};

export const db = {
    products: (isWorker ? workerDb : primaryDb) as DbProducts,
};  