import Fastify from 'fastify';
import { errorHandler } from 'utils/errorHandler';
import { productRoutes } from 'features/products/product.routes';

export const createApp = (isLoggerON: boolean = true) => {
    const app = Fastify({
        logger: isLoggerON,
    });

    errorHandler(app);

    app.register(productRoutes, { prefix: '/api' });

    return app;
};