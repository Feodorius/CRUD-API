import { Product, UpdateProductDto } from 'models/product.model';

export type IpcRequest =
    | { type: 'FIND_ALL' }
    | { type: 'FIND_BY_ID'; id: string }
    | { type: 'CREATE'; data: Product }
    | { type: 'UPDATE'; id: string; data: UpdateProductDto }
    | { type: 'DELETE'; id: string };

export type IpcResponse =
    | { type: 'FIND_ALL'; data: Product[] }
    | { type: 'FIND_BY_ID'; data: Product | undefined }
    | { type: 'CREATE'; data: Product }
    | { type: 'UPDATE'; data: Product }
    | { type: 'DELETE'; data: void }