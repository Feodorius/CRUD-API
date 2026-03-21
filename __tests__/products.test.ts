import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app';

const app = createApp();

describe('E2E TEST - Full product lifecycle', () => {
    it('should create, get, update, delete and verify deletion', async () => {
        const getAllResponse = await app.inject({
            method: 'GET',
            url: '/api/products',
        });
        expect(getAllResponse.statusCode).toBe(200);
        expect(getAllResponse.json()).toEqual([]);

        const createResponse = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: {
                name: 'MacBook Pro',
                description: 'Apple laptop',
                price: 1999,
                category: 'electronics',
                inStock: true,
            },
        });
        expect(createResponse.statusCode).toBe(201);
        const { id } = createResponse.json();
        expect(id).toBeDefined();

        const getResponse = await app.inject({
            method: 'GET',
            url: `/api/products/${id}`,
        });
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.json().id).toBe(id);

        const updateResponse = await app.inject({
            method: 'PUT',
            url: `/api/products/${id}`,
            payload: {
                name: 'MacBook Pro M3',
                description: 'Apple laptop updated',
                price: 2499,
                category: 'electronics',
                inStock: false,
            },
        });
        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.json()).toMatchObject({
            id,
            name: 'MacBook Pro M3',
            price: 2499,
            inStock: false,
        });

        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: `/api/products/${id}`,
        });
        expect(deleteResponse.statusCode).toBe(204);

        const getDeletedResponse = await app.inject({
            method: 'GET',
            url: `/api/products/${id}`,
        });
        expect(getDeletedResponse.statusCode).toBe(404);
    });

    it('should create 3 products, verify count, delete one and verify count', async () => {
        const products = [
            {
                name: 'iPhone 15',
                description: 'Apple smartphone',
                price: 999,
                category: 'electronics',
                inStock: true,
            },
            {
                name: 'MacBook Pro',
                description: 'Apple laptop',
                price: 1999,
                category: 'electronics',
                inStock: true,
            },
            {
                name: 'AirPods Pro',
                description: 'Apple earphones',
                price: 249,
                category: 'electronics',
                inStock: false,
            },
        ];

        const createdIds: string[] = [];

        for (const product of products) {
            const response = await app.inject({
                method: 'POST',
                url: '/api/products',
                payload: product,
            });
            expect(response.statusCode).toBe(201);
            createdIds.push(response.json().id);
        }

        const getAllResponse = await app.inject({
            method: 'GET',
            url: '/api/products',
        });
        expect(getAllResponse.statusCode).toBe(200);
        expect(getAllResponse.json()).toHaveLength(3);

        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: `/api/products/${createdIds[0]}`,
        });
        expect(deleteResponse.statusCode).toBe(204);

        const getAllAfterDeleteResponse = await app.inject({
            method: 'GET',
            url: '/api/products',
        });
        expect(getAllAfterDeleteResponse.statusCode).toBe(200);
        expect(getAllAfterDeleteResponse.json()).toHaveLength(2);
    });

    it('should return 400 for invalid product data', async () => {
        const emptyBodyResponse = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: {},
        });
        expect(emptyBodyResponse.statusCode).toBe(400);

        const missingFieldResponse = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: {
                name: 'iPhone 15',
            },
        });
        expect(missingFieldResponse.statusCode).toBe(400);

        const negativePriceResponse = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: {
                name: 'iPhone 15',
                description: 'Apple smartphone',
                price: -1,
                category: 'electronics',
                inStock: true,
            },
        });
        expect(negativePriceResponse.statusCode).toBe(400);

        const zeroPriceResponse = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: {
                name: 'iPhone 15',
                description: 'Apple smartphone',
                price: 0,
                category: 'electronics',
                inStock: true,
            },
        });
        expect(zeroPriceResponse.statusCode).toBe(400);

        const validResponse = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: {
                name: 'iPhone 15',
                description: 'Apple smartphone',
                price: 999,
                category: 'electronics',
                inStock: true,
            },
        });
        expect(validResponse.statusCode).toBe(201);
    });
});