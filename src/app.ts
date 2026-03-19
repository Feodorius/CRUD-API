import Fastify from 'fastify';
import { errorHandler } from 'utils/errorHandler';
import { productRoutes } from 'features/products/product.routes';

export const createApp = () => {
    const app = Fastify({
        logger: true,
    });

    errorHandler(app);

    app.register(productRoutes, { prefix: '/api' });

    return app;
};