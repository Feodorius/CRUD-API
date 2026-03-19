import { randomUUID } from 'crypto';
import { db } from 'db/inMemoryDb';
import { Product, CreateProductDto, UpdateProductDto } from 'models/product.model';

export const getAllProducts = (): Product[] => {
    return db.products.findAll();
};

export const getProductById = (id: string): Product | undefined => {
    return db.products.findById(id);
};

export const createProduct = (data: CreateProductDto): Product => {
    const product: Product = {
        id: randomUUID(),
        ...data,
    };
    return db.products.create(product);
};

export const updateProduct = (id: string, data: UpdateProductDto): Product | undefined => {
    const existing = db.products.findById(id);
    if (!existing) return undefined;
    return db.products.update(id, data);
};

export const deleteProduct = (id: string) => {
    const existing = db.products.findById(id);
    if (existing) {
        db.products.delete(id);
    }
    return existing;
};