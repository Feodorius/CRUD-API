import { FastifyInstance } from 'fastify';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from 'features/products/product.handler';

export const productRoutes = async (app: FastifyInstance) => {
    app.get('/products', getAllProducts);
    app.get('/products/:productId', getProductById);
    app.post('/products', createProduct);
    app.put('/products/:productId', updateProduct);
    app.delete('/products/:productId', deleteProduct);
};