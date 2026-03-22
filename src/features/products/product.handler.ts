import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateProductSchema, UpdateProductSchema } from 'models/product.model';
import * as productService from 'features/products/product.service';
import { isValidUuid } from 'utils/validateUuid';
import { sendInvalidUuid, sendNotFound, sendValidationError } from 'utils/errorHandler';

type ProductIdParam = { productId: string };

export const getAllProducts = async (_request: FastifyRequest, reply: FastifyReply) => {
    const products = await productService.getAllProducts();
    reply.status(200).send(products);
};

export const getProductById = async (
    request: FastifyRequest<{ Params: ProductIdParam }>,
    reply: FastifyReply
) => {
    const { productId } = request.params;

    if (!isValidUuid(productId)) return sendInvalidUuid(reply);

    const product = await productService.getProductById(productId);
    if (!product) return sendNotFound(reply, productId);

    reply.status(200).send(product);
};

export const createProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateProductSchema.safeParse(request.body);

    if (!parsed.success) return sendValidationError(reply, parsed.error);

    const product = await productService.createProduct(parsed.data);
    reply.status(201).send(product);
};

export const updateProduct = async (
    request: FastifyRequest<{ Params: ProductIdParam }>,
    reply: FastifyReply
) => {
    const { productId } = request.params;

    if (!isValidUuid(productId)) return sendInvalidUuid(reply);

    const parsed = UpdateProductSchema.safeParse(request.body);
    if (!parsed.success) return sendValidationError(reply, parsed.error);

    const product = await productService.updateProduct(productId, parsed.data);
    if (!product) return sendNotFound(reply, productId);

    reply.status(200).send(product);
};

export const deleteProduct = async (
    request: FastifyRequest<{ Params: ProductIdParam }>,
    reply: FastifyReply
) => {
    const { productId } = request.params;

    if (!isValidUuid(productId)) return sendInvalidUuid(reply);

    const deleted = await productService.deleteProduct(productId);
    if (!deleted) return sendNotFound(reply, productId);

    reply.status(204).send();
};