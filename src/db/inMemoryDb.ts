import { Product } from 'models/product.model';

let products: Product[] = [];

export const db = {
    products: {
        findAll: (): Product[] => {
            return products;
        },

        findById: (id: string): Product | undefined => {
            return products.find((product) => product.id === id);
        },

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
    },
};