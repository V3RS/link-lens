# Link Lens

A modern web application for previewing links with real-time processing. Users can submit URLs, and Link Lens asynchronously extracts Open Graph metadata to display rich previews with images and titles. Built with a focus on performance, reliability, and user experience.

## Tech Stack & Rationale

| Technology | Why I Picked It |
|------------|----------------|
| Node.js + TypeScript | Type safety and modern JavaScript features for robust backend development |
| Express | Lightweight, flexible web framework with excellent middleware ecosystem |
| Prisma + PostgreSQL | Type-safe ORM with excellent developer experience and reliable relational database |
| BullMQ + Redis | Robust job queue system for handling asynchronous URL processing |
| undici | Modern, high-performance HTTP client with built-in timeout and retry capabilities |
| node-html-parser | Fast, lightweight HTML parser for extracting Open Graph metadata |
| Zod | Runtime type validation with excellent TypeScript integration |
| Vitest + Supertest | Modern testing framework with comprehensive API testing capabilities |
| React + Vite | Fast development experience with modern React tooling |
| Tailwind CSS | Utility-first CSS for rapid, consistent UI development |

I picked a lot of technologies based on familiarity so I could give this project my best effort, while still balancing modern, practical choices.

## AI Partnership

I partnered with AI tools throughout this project to accelerate development while maintaining high code quality. Cursor helped with architecture scaffolding and code generation, while I used various AI tools for research and problem-solving. The AI partnership enabled me to focus on architecture decisions and business logic rather than boilerplate, while ensuring I understood and could maintain every line of code.

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**
- **Docker** and **Docker Compose**

### Optional Monitoring Tools

- **Redis GUI** (RedisInsight, Redis Desktop Manager) - to monitor job queues and worker processes
- **PostgreSQL GUI** (pgAdmin, TablePlus) - to inspect database records

**What Redis does:** Manages the job queue for asynchronous URL processing
**What PostgreSQL does:** Persistent storage for URL submissions and their metadata

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials if needed
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   # Note: PostgreSQL runs on port 5433 to avoid conflicts
   ```

4. **Install dependencies and setup database**
   ```bash
   npm install
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start API server**
   ```bash
   npm run dev
   # API runs on http://localhost:3000
   ```

6. **Start worker (in a second terminal)**
   ```bash
   cd backend
   npm run worker
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install and start**
   ```bash
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

### Visiting the App

1. Open http://localhost:5173
2. Enter a URL in the form (try: https://github.com, https://vsingh.dev)
3. Backend queues and processes the URL asynchronously
4. Frontend polls the API and shows real-time status updates
5. View the extracted preview image, title, and submission history

## Key Features & Approach

### Core Features

- **URL Submission** - Simple form interface for entering links
- **Async Processing** - Background job processing with BullMQ
- **Real-time Status Updates** - Live polling shows QUEUED → PROCESSING → COMPLETE states
- **Rich Previews** - Extracts Open Graph images and titles
- **Persistent History** - All submissions saved with server-side pagination
- **Error Handling** - Graceful handling of failed requests and invalid URLs
- **Theme Support** - Dark/light mode toggle with CSS variables

### Architectural Approach

I chose an **asynchronous queue-based architecture** over inline processing for several key reasons:

**Fast Response Times**: The API responds immediately when a URL is submitted, regardless of how long the external site takes to respond. This keeps the user interface snappy and responsive.

**Reliability & Resilience**: If an external site is slow or temporarily unavailable, it doesn't block other operations. The worker can retry failed jobs and handle errors gracefully without affecting the main application flow.

**Scalability**: The queue system allows for horizontal scaling - multiple workers can process jobs concurrently, and the system can handle traffic spikes by queueing requests.

**Clear Status Flow**: Users see exactly what's happening with their submission through clear status transitions, making the system transparent and debuggable.

### Application Flow

1. **User submits URL** → API validates and saves submission with `QUEUED` status
2. **BullMQ worker picks up job** → Changes status to `PROCESSING`
3. **Worker fetches HTML** → Uses undici with timeouts and retries
4. **Extract Open Graph data** → Parses HTML for `og:image`, `og:title`, etc.
5. **Update database** → Status becomes `COMPLETE`, `NO_OG`, or `FAILED`
6. **Frontend polls API** → Real-time updates shown to user with toast notifications

## Challenges & Solutions

### Server-Side Pagination Implementation

**Challenge**: The initial client-side pagination was fetching all data and slicing it locally, which wouldn't scale and caused issues with the "latest submission" display.

**Solution**: Implemented proper offset-based server-side pagination. The API now accepts `offset` and `limit` parameters, and the frontend makes separate optimized calls: one for the latest submission (always item #1) and another for paginated history items. This reduced network calls by 50% during navigation and provides true scalability.

### Real-Time Status Updates Without WebSockets

**Challenge**: Users needed to see status changes in real-time, but I wanted to avoid the complexity of WebSocket connections.

**Solution**: Implemented intelligent polling that only activates when there are active jobs (`QUEUED` or `PROCESSING` status). The frontend polls every 2 seconds during active processing and stops when all jobs complete. Combined with toast notifications, this provides a real-time feel with simple HTTP requests.

### Handling Unreliable External Sites

**Challenge**: External websites can be slow, return malformed HTML, or use relative URLs for images, leading to failed previews or broken image links.

**Solution**: Used `undici` with 7-second timeouts and proper error boundaries. Added URL validation to reject unsafe schemes like `file://`. For relative image URLs, implemented proper resolution using `new URL(relative, base)` to always generate absolute URLs.

## Testing & Quality

### Test-Driven Development Approach

I built this project using **Test-Driven Development (TDD)**, writing tests before implementation. This approach proved invaluable for several reasons:

**Clear Requirements**: Writing tests first forced me to think through the exact behavior each function should have, leading to cleaner, more focused implementations.

**Confidence in Refactoring**: When implementing server-side pagination and optimizing network calls, the comprehensive test suite ensured no regressions were introduced during major architectural changes.

**Better Error Handling**: TDD naturally led to testing edge cases (invalid URLs, network failures, malformed HTML), resulting in more robust error handling than I would have implemented otherwise.

### Test Coverage

- **Unit Tests**: Core logic (HTML parsing, URL validation, worker processing)
- **Integration Tests**: Database operations with real PostgreSQL connections
- **API Tests**: Full HTTP request/response cycles with Supertest
- **E2E Tests**: Complete workflow from URL submission to final status updates
- **Type Safety**: Comprehensive TypeScript coverage with strict mode enabled

The test suite includes realistic scenarios like parsing HTML with missing Open Graph tags, handling network timeouts, and validating pagination edge cases. This comprehensive coverage caught several subtle bugs during development and gives confidence when deploying changes.

Run tests:
```bash
cd backend
npm test        # Run all tests
npm run test:watch  # Watch mode for development
```

## Contact & Acknowledgements

**Veer Singh**  
[LinkedIn](https://www.linkedin.com/in/veerkaran-singh/) | [GitHub](https://github.com/V3RS)

Don't hesitate to reach out if you want to chat about the project or anything engineering. I'm always excited to discuss technical decisions, architecture trade-offs, or potential improvements.

---