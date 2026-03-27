import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    inStock: z.boolean(),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = CreateProductSchema;

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export type DbProducts = {
    findAll: () => Product[] | Promise<Product[]>;
    findById: (id: string) => Product | undefined | Promise<Product | undefined>;
    create: (product: Product) => Product | Promise<Product>;
    update: (id: string, data: Omit<Product, 'id'>) => Product | Promise<Product>;
    delete: (id: string) => void | Promise<void>;
};