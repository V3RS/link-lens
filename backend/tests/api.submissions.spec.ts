import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@/app.js';

// Mock queue to avoid Redis in unit tests
vi.mock('@/lib/queue.js', () => ({
  queue: {
    add: vi.fn(),
  },
}));

vi.mock('@/lib/db.js', () => ({
  prisma: {
    submission: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { queue } from '@/lib/queue.js';
import { prisma } from '@/lib/db.js';

describe('API /api/submissions', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/submissions', () => {
    it('returns 200 for valid url and enqueues job', async () => {
      const now = new Date();
      const mockSubmission = {
        id: 'test-id',
        url: 'https://example.com',
        status: 'QUEUED',
        ogImageUrl: null,
        ogTitle: null,
        error: null,
        createdAt: now,
        updatedAt: now,
      };

      vi.mocked(prisma.submission.create).mockResolvedValue(mockSubmission);
      vi.mocked(queue.add).mockResolvedValue({} as any);

      const response = await request(app)
        .post('/api/submissions')
        .send({ url: 'https://example.com' });

      expect(response.status).toBe(200);
      // Check structure and values (dates will be serialized to ISO strings)
      expect(response.body).toMatchObject({
        id: 'test-id',
        url: 'https://example.com',
        status: 'QUEUED',
        ogImageUrl: null,
        ogTitle: null,
        error: null,
      });
      expect(typeof response.body.createdAt).toBe('string');
      expect(typeof response.body.updatedAt).toBe('string');
      expect(queue.add).toHaveBeenCalledWith('og-scan', { submissionId: 'test-id' });
    });

    it('returns 400 for invalid url', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({ url: 'not-a-url' });

      expect(response.status).toBe(400);
    });

    it('returns 400 for missing url', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/submissions', () => {
    it('returns paginated response with default parameters', async () => {
      const mockSubmissions = [
        {
          id: 'newer',
          url: 'https://newer.com',
          status: 'COMPLETE',
          createdAt: new Date('2023-12-02'),
        },
        {
          id: 'older',
          url: 'https://older.com',
          status: 'COMPLETE',
          createdAt: new Date('2023-12-01'),
        },
      ];

      vi.mocked(prisma.submission.findMany).mockResolvedValue(mockSubmissions as any);
      vi.mocked(prisma.submission.count).mockResolvedValue(15);

      const response = await request(app)
        .get('/api/submissions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            id: 'newer',
            url: 'https://newer.com',
            status: 'COMPLETE',
            createdAt: '2023-12-02T00:00:00.000Z',
          },
          {
            id: 'older',
            url: 'https://older.com',
            status: 'COMPLETE',
            createdAt: '2023-12-01T00:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 15,
          totalPages: 2,
          hasNext: true,
          hasPrevious: false,
          offset: 0,
        },
      });
      expect(prisma.submission.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(prisma.submission.count).toHaveBeenCalled();
    });

    it('handles custom pagination parameters', async () => {
      const mockSubmissions = [{ id: 'test', status: 'COMPLETE' }];
      
      vi.mocked(prisma.submission.findMany).mockResolvedValue(mockSubmissions as any);
      vi.mocked(prisma.submission.count).mockResolvedValue(25);

      const response = await request(app)
        .get('/api/submissions?page=3&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.pagination).toEqual({
        page: 3,
        limit: 5,
        total: 25,
        totalPages: 5,
        hasNext: true,
        hasPrevious: true,
        offset: 10,
      });
      expect(prisma.submission.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 10,
        take: 5,
      });
    });

    it('handles offset parameter', async () => {
      const mockSubmissions = [{ id: 'test', status: 'COMPLETE' }];
      
      vi.mocked(prisma.submission.findMany).mockResolvedValue(mockSubmissions as any);
      vi.mocked(prisma.submission.count).mockResolvedValue(25);

      const response = await request(app)
        .get('/api/submissions?offset=5&limit=4');

      expect(response.status).toBe(200);
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 4,
        total: 25,
        totalPages: 7,
        hasNext: true,
        hasPrevious: true,
        offset: 5,
      });
      expect(prisma.submission.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 5,
        take: 4,
      });
    });

    it('returns 400 for invalid pagination parameters', async () => {
      const response = await request(app)
        .get('/api/submissions?page=0&limit=100');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid pagination parameters');
    });
  });
});
