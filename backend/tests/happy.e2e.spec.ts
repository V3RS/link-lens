import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '@/app.js';
import { processSubmission } from '../worker/index.js';

// Mock network to avoid real HTTP requests
vi.mock('@/lib/og.js', async () => {
  const actual = await vi.importActual('@/lib/og.js');
  return {
    ...actual,
    fetchHtml: vi.fn(),
  };
});

import { fetchHtml } from '@/lib/og.js';

describe('Happy Path E2E', () => {
  const app = createApp();

  it('POST → worker processing → GET with COMPLETE status', async () => {
    vi.mocked(fetchHtml).mockResolvedValue(`
      <html>
        <head>
          <meta property="og:image" content="https://test.com/image.png">
          <meta property="og:title" content="Test Title">
        </head>
      </html>
    `);

    // POST to create QUEUED submission
    const createResponse = await request(app)
      .post('/api/submissions')
      .send({ url: 'https://test.com' });

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.status).toBe('QUEUED');

    const submissionId = createResponse.body.id;

    // Directly invoke worker to simulate job processing
    await processSubmission({ submissionId });

    // GET to verify COMPLETE status
    const getResponse = await request(app)
      .get('/api/submissions');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('data');
    expect(getResponse.body).toHaveProperty('pagination');
    
    const submission = getResponse.body.data.find((s: any) => s.id === submissionId);
    expect(submission.status).toBe('COMPLETE');
    expect(submission.ogImageUrl).toBe('https://test.com/image.png');
    expect(submission.ogTitle).toBe('Test Title');
  });
});
