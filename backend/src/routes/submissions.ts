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

const getSubmissionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().min(0).optional(),
});

router.get('/', async (req, res) => {
  try {
    const { page, limit, offset } = getSubmissionsSchema.parse(req.query);
    const skip = offset !== undefined ? offset : (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.submission.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: submissions,
      pagination: {
        page: offset !== undefined ? Math.floor(skip / limit) + 1 : page,
        limit,
        total,
        totalPages,
        hasNext: skip + limit < total,
        hasPrevious: skip > 0,
        offset: skip,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
