# CRUD API

A RESTful CRUD API built with Fastify and TypeScript.

## Requirements

- Node.js 22+
- npm 10+

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crud-api
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the root directory:

```
PORT=4000
```

## Running the application

### Development mode
Runs the application with nodemon and ts-node. The server will restart automatically on file changes.

```bash
npm run start:dev
```

### Production mode
Bundles the application with esbuild and runs it.

```bash
npm run start:prod
```

### Multi-process mode
Runs the application in cluster mode with a load balancer.
The number of workers is based on the number of available CPU cores (`os.availableParallelism() - 1`).

```bash
npm run start:multi
```

### Transpile TypeScript
Transpiles TypeScript to JavaScript in the `build` folder.

```bash
npm run transpile
```

## Running tests

### Run tests once

```bash
npm run test
```

### Run tests in watch mode

```bash
npm run test:watch
```

## API Endpoints

Base URL: `http://localhost:4000/api`

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:productId` | Get product by id |
| POST | `/products` | Create a new product |
| PUT | `/products/:productId` | Update a product |
| DELETE | `/products/:productId` | Delete a product |

### Request body (POST/PUT)

```json
{
  "name": "iPhone 15",
  "description": "Apple smartphone",
  "price": 999,
  "category": "electronics",
  "inStock": true
}
```

### Response body

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "iPhone 15",
  "description": "Apple smartphone",
  "price": 999,
  "category": "electronics",
  "inStock": true
}
```

## Status codes

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (invalid UUID or validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Multi-process mode

In multi-process mode the application runs with a load balancer and multiple workers.

```
Load Balancer (PORT 4000)
        ↓ Round-robin
┌───────────────────────┐
│                       │
Worker 1            Worker N
(PORT 4001)    (PORT 400N)
```

- Load balancer listens on `PORT` (default: 4000)
- Workers listen on `PORT + 1`, `PORT + 2`, etc.
- Requests are distributed between workers using round-robin algorithm
- If a worker dies, it is automatically restarted on the same port
- Database is stored in the primary process and shared between workers via IPC

## Project structure

```
src/
├── app.ts                      # Fastify app factory
├── index.ts                    # Entry point
├── cluster.ts                  # Multi-process mode entry point
├── db/
│   └── inMemoryDb.ts           # In-memory database
├── features/
│   └── products/
│       ├── product.handler.ts  # Request handlers
│       ├── product.routes.ts   # Routes
│       └── product.service.ts  # Business logic
├── models/
│   ├── product.model.ts        # Product types and schemas
│   └── ipc.model.ts            # IPC message types
└── utils/
    ├── color.ts                # Terminal colors
    ├── env.ts                  # Environment variables
    ├── errorHandler.ts         # Error handling
    ├── ipcHandlers.ts          # IPC message handlers
    ├── ipcWorker.ts            # IPC worker utilities
    ├── loadBalancer.ts         # Load balancer
    └── validateUuid.ts         # UUID validation
```