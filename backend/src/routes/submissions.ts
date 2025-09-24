import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { queue } from '../lib/queue.js';

const router = Router();

const createSubmissionSchema = z.object({
  url: z.string().url(),
});

router.post('/', async (req, res) => {
  try {
    const { url } = createSubmissionSchema.parse(req.body);

    const submission = await prisma.submission.create({
      data: {
        url,
        status: 'QUEUED',
      },
    });

    await queue.add('og-scan', { submissionId: submission.id });

    res.json(submission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
