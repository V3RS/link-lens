import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { prisma } from '@/lib/db.js';

describe('Database Integration', () => {
  beforeAll(async () => {
    execSync('npx prisma db push --force-reset', { cwd: process.cwd() });
  });

  beforeEach(async () => {
    await prisma.submission.deleteMany();
  });

  it('orders submissions by createdAt desc', async () => {
    const older = await prisma.submission.create({
      data: {
        url: 'https://older.com',
        status: 'COMPLETE',
        createdAt: new Date('2023-01-01'),
      },
    });

    const newer = await prisma.submission.create({
      data: {
        url: 'https://newer.com',
        status: 'COMPLETE', 
        createdAt: new Date('2023-01-02'),
      },
    });

    const results = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe(newer.id);
    expect(results[1].id).toBe(older.id);
  });

  it('limits results to 100', async () => {
    const submissions = Array.from({ length: 150 }, (_, i) => ({
      url: `https://example${i}.com`,
      status: 'COMPLETE' as const,
    }));

    for (const submission of submissions) {
      await prisma.submission.create({ data: submission });
    }

    const results = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    expect(results).toHaveLength(100);
  });
});
