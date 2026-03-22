import { createApp } from 'app';
import cluster from 'cluster';
import os from "os";
import { colorize } from 'utils/color';
import { env } from 'utils/env';
import { addIpcMessageHandler } from 'utils/ipcHandlers';
import { createLoadBalancer } from 'utils/loadBalancer';

const numWorkers = os.availableParallelism() - 1;
const portsMap = new Map<number, number>();


if (cluster.isPrimary) {
    console.log(colorize(`Primary process started. PID: ${process.pid}`, 'yellow'));
    console.log(colorize(`Starting ${numWorkers} workers...`, 'yellow'));

    for (let i = 0; i < numWorkers; i++) {
        const port = env.PORT + i + 1;
        const worker = cluster.fork({ WORKER_PORT: port });
        portsMap.set(worker.id, port);
        addIpcMessageHandler(worker);
    }

    const workerPorts = Array.from({ length: numWorkers }, (_, i) => env.PORT + i + 1);
    createLoadBalancer(env.PORT, workerPorts);

    cluster.on('exit', (worker) => {

        console.log(colorize(`Worker ${worker.process.pid} died.`, 'red'));
        console.log(colorize(`Starting new worker...`, 'yellow'));

        const oldPort = portsMap.get(worker.id);
        portsMap.delete(worker.id);

        if (!oldPort) return;
        const newWorker = cluster.fork({ WORKER_PORT: oldPort });
        portsMap.set(newWorker.id, oldPort);
        addIpcMessageHandler(newWorker);
        newWorker.on('online', () => {
            console.log(colorize(`New worker PID: ${newWorker.process.pid} started on port ${oldPort}`, 'green'));
        });
    });

    process.on('SIGINT', () => {
        console.log(colorize('Shutting down...', 'yellow'));
        for (const id in cluster.workers) {
            cluster.workers[id]?.kill();
        }
        process.exit(0);
    });
} else {
    const workerPort = Number(process.env.WORKER_PORT);

    const start = async () => {
        const app = createApp(false);

        app.addHook('onRequest', (request, reply, done) => {
            console.log(colorize(`Worker PID: ${process.pid} on port ${workerPort} received ${request.method} ${request.url}`, 'magenta'));
            done();
        });

        try {
            await app.listen({ port: workerPort });
            console.log(colorize(`Worker PID: ${process.pid} listening on port ${workerPort}`, 'cyan'));
        } catch (error) {
            app.log.error(error);
            process.exit(1);
        }
    };
    start();
}