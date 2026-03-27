import { FastifyInstance, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export const errorHandler = (app: FastifyInstance) => {

    app.setNotFoundHandler((_request, reply) => {
        reply.status(404).send({
            statusCode: 404,
            message: 'Route not found',
        });
    });

    app.setErrorHandler((error, _request, reply) => {
        app.log.error(error);

        reply.status(500).send({
            statusCode: 500,
            message: 'Internal server error',
        });
    });
};

export const sendInvalidUuid = (reply: FastifyReply) => {
    reply.status(400).send({ statusCode: 400, message: 'Invalid product id, must be a UUID' });
};

export const sendNotFound = (reply: FastifyReply, productId: string) => {
    reply.status(404).send({ statusCode: 404, message: `Product with id ${productId} not found` });
};

export const sendValidationError = (reply: FastifyReply, error: ZodError): void => {
    reply.status(400).send({ statusCode: 400, message: error.issues.map(i => i.message).join(', ') });
};