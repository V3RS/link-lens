import { Worker } from 'bullmq';
import { REDIS_URL } from '../src/env.js';
import { prisma } from '../src/lib/db.js';
import { fetchHtml, extractOg, isSafeHttp } from '../src/lib/og.js';

export async function processSubmission(job: { submissionId: string }): Promise<void> {
  const { submissionId } = job;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error(`Submission ${submissionId} not found`);
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: 'PROCESSING' },
  });

  try {
    if (!isSafeHttp(submission.url)) {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'FAILED',
          error: 'Invalid URL scheme',
        },
      });
      return;
    }

    const html = await fetchHtml(submission.url);

    const result = extractOg(html, submission.url);

    if (result.kind === 'no_og') {
      await prisma.submission.update({
        where: { id: submissionId },
        data: { status: 'NO_OG' },
      });
    } else {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'COMPLETE',
          ogImageUrl: result.imageUrl,
          ogTitle: result.title,
        },
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'FAILED',
        error: errorMessage,
      },
    });
  }
}

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const worker = new Worker('og-scan', async (job) => {
    await processSubmission(job.data);
  }, {
    connection: {
      url: REDIS_URL,
    },
  });

  console.log('Worker started');
}
