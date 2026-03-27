import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            utils: path.resolve(__dirname, './src/utils'),
            features: path.resolve(__dirname, './src/features'),
            models: path.resolve(__dirname, './src/models'),
            db: path.resolve(__dirname, './src/db'),
        },
    },
    test: {
        globals: true,
    },
});