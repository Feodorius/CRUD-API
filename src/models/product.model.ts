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