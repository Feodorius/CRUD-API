import { randomUUID } from 'crypto';
import { db } from 'db/inMemoryDb';
import { Product, CreateProductDto, UpdateProductDto } from 'models/product.model';

export const getAllProducts = async (): Promise<Product[]> => {
    return await db.products.findAll();
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    return await db.products.findById(id);
};

export const createProduct = async (data: CreateProductDto): Promise<Product> => {
    const product: Product = {
        id: randomUUID(),
        ...data,
    };
    return await db.products.create(product);
};

export const updateProduct = async (id: string, data: UpdateProductDto): Promise<Product | undefined> => {
    const existing = await db.products.findById(id);
    if (!existing) return undefined;
    return await db.products.update(id, data);
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    const existing = await db.products.findById(id);
    if (!existing) return false;
    await db.products.delete(id);
    return true;
};