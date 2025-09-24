# Link Lens Backend

Node.js TypeScript backend for extracting Open Graph image previews from URLs.

## Architecture

- **Express API** for receiving URL submissions
- **BullMQ + Redis** for async processing queue
- **PostgreSQL** for persistence with Prisma ORM
- **Worker process** fetches and parses HTML for OG tags

## Setup

1. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

2. Start services:
```bash
docker-compose up -d
```

3. Setup database:
```bash
npm run prisma:migrate
npm run prisma:generate
```

**Note:** Docker PostgreSQL runs on port 5433 to avoid conflicts with local installations.

## Running

```bash
# API server
npm run dev

# Worker (separate terminal)
npm run worker

# Tests
npm test

# Tests with coverage
npm run test
```
