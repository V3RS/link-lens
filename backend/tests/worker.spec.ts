import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processSubmission } from '../worker/index.js';

// Mock dependencies
vi.mock('@/lib/db.js', () => ({
  prisma: {
    submission: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('undici', () => ({
  request: vi.fn(),
}));

vi.mock('@/lib/og.js', () => ({
  fetchHtml: vi.fn(),
  extractOg: vi.fn(),
  isSafeHttp: vi.fn(),
}));

import { prisma } from '@/lib/db.js';
import { fetchHtml, extractOg, isSafeHttp } from '@/lib/og.js';

describe('Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes happy path: QUEUED → PROCESSING → COMPLETE', async () => {
    vi.mocked(prisma.submission.findUnique).mockResolvedValue({
      id: 'test-id',
      url: 'https://example.com',
      status: 'QUEUED',
      ogImageUrl: null,
      ogTitle: null,
      error: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(isSafeHttp).mockReturnValue(true);
    vi.mocked(fetchHtml).mockResolvedValue('<html></html>');
    vi.mocked(extractOg).mockReturnValue({
      kind: 'ok',
      imageUrl: 'https://example.com/image.png',
      title: 'Test Title'
    });

    await processSubmission({ submissionId: 'test-id' });

    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: { status: 'PROCESSING' }
    });

    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: {
        status: 'COMPLETE',
        ogImageUrl: 'https://example.com/image.png',
        ogTitle: 'Test Title'
      }
    });
  });

  it('handles no OG case: → NO_OG', async () => {
    vi.mocked(prisma.submission.findUnique).mockResolvedValue({
      id: 'test-id',
      url: 'https://example.com',
      status: 'QUEUED',
      ogImageUrl: null,
      ogTitle: null,
      error: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(isSafeHttp).mockReturnValue(true);
    vi.mocked(fetchHtml).mockResolvedValue('<html></html>');
    vi.mocked(extractOg).mockReturnValue({ kind: 'no_og' });

    await processSubmission({ submissionId: 'test-id' });

    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: { status: 'NO_OG' }
    });
  });

  it('handles network error: → FAILED', async () => {
    vi.mocked(prisma.submission.findUnique).mockResolvedValue({
      id: 'test-id',
      url: 'https://example.com',
      status: 'QUEUED',
      ogImageUrl: null,
      ogTitle: null,
      error: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(isSafeHttp).mockReturnValue(true);
    vi.mocked(fetchHtml).mockRejectedValue(new Error('Network timeout'));

    await processSubmission({ submissionId: 'test-id' });

    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: {
        status: 'FAILED',
        error: 'Network timeout'
      }
    });
  });

  it('handles invalid scheme: → FAILED', async () => {
    vi.mocked(prisma.submission.findUnique).mockResolvedValue({
      id: 'test-id',
      url: 'ftp://example.com',
      status: 'QUEUED',
      ogImageUrl: null,
      ogTitle: null,
      error: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(isSafeHttp).mockReturnValue(false);

    await processSubmission({ submissionId: 'test-id' });

    expect(prisma.submission.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: {
        status: 'FAILED',
        error: 'Invalid URL scheme'
      }
    });
  });
});
