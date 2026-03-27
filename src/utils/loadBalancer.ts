import http from 'http';
import { colorize } from './color';

export const createLoadBalancer = (port: number, workerPorts: number[]): void => {
    let current = 0;

    const loadBalancer = http.createServer((req, res) => {
        const targetPort = workerPorts[current];
        current = (current + 1) % workerPorts.length;

        const options = {
            hostname: 'localhost',
            port: targetPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const proxy = http.request(options, (workerRes) => {
            res.writeHead(workerRes.statusCode!, workerRes.headers);
            workerRes.pipe(res);
        });

        req.pipe(proxy);

        proxy.on('error', (error) => {
            console.log(colorize(`Load balancer error: ${error.message}`, 'red'));
            res.writeHead(502);
            res.end('Bad Gateway');
        });
    });

    loadBalancer.listen(port, () => {
        console.log(colorize(`Load balancer listening on port ${port}`, 'green'));
    });
};