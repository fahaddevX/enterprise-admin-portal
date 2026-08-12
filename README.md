# Enterprise Admin Portal

- Mary in engineering wants a reliable, popular TypeScript-based stack.
- Susan in product wants: CSV upload for large user data files, CRM API sync, a live import progress status page, and in-app notifications when imports finish.
- Steve in marketing wants an attractive site that works well in a modern browser.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** running locally (default port 5432)
- **Redis** running locally (default port 6379)

### Install dependencies

```bash
npm install
```

### Configure environment

Copy the example env file and fill in your local values:

```bash
cp .env.example .env.local
```

```
DATABASE_URL="postgresql://<user>@localhost:5432/<dbname>"
REDIS_URL="redis://localhost:6379"
```

### Run database migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### Start the app

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Start the sync worker (separate terminal)

The CRM sync worker must run alongside the Next.js server to process queued jobs:

```bash
npx tsx workers/sync.ts
```
