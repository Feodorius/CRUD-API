import { createApp } from 'app';
import { env } from 'utils/env';

const start = async (): Promise<void> => {
    const app = createApp();

    try {
        await app.listen({ port: env.PORT });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();