import express from 'express';
import { prisma } from './db';
import { authMiddleware } from './auth';
import { z } from 'zod';
import { logger } from './logger';

const router = express.Router();

const blogSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  isPublished: z.boolean().optional(),
});

const slugify = (text: string) => 
  text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

router.use(authMiddleware);

// Get my blogs
router.get('/', async (req: any, res) => {
  const blogs = await prisma.blog.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(blogs);
});

// Create blog
router.post('/', async (req: any, res) => {
  try {
    const { title, content, isPublished } = blogSchema.parse(req.body);
    const slug = slugify(title);
    
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        isPublished: isPublished ?? false,
        slug,
        userId: req.userId,
      },
    });

    // Simulate async job for summary generation
    setImmediate(async () => {
      try {
        const summary = content.substring(0, 150) + '...';
        await prisma.blog.update({
          where: { id: blog.id },
          data: { summary },
        });
        logger.info({ blogId: blog.id }, 'Summary generated asynchronously');
      } catch (err) {
        logger.error(err, 'Async job failed');
      }
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Update blog
router.patch('/:id', async (req: any, res) => {
  try {
    const { title, content, isPublished } = blogSchema.partial().parse(req.body);
    
    const blog = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!blog || blog.userId !== req.userId) {
      return res.status(404).json({ error: 'Blog not found or unauthorized' });
    }

    const updated = await prisma.blog.update({
      where: { id: req.params.id },
      data: { title, content, isPublished },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Delete blog
router.delete('/:id', async (req: any, res) => {
  const blog = await prisma.blog.findUnique({ where: { id: req.params.id } });
  if (!blog || blog.userId !== req.userId) {
    return res.status(404).json({ error: 'Blog not found or unauthorized' });
  }

  await prisma.blog.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// Like/Unlike
router.post('/:id/like', async (req: any, res) => {
  try {
    await prisma.like.create({
      data: {
        userId: req.userId,
        blogId: req.params.id,
      },
    });
    const count = await prisma.like.count({ where: { blogId: req.params.id } });
    res.json({ count });
  } catch (error) {
    res.status(400).json({ error: 'Already liked or error' });
  }
});

router.delete('/:id/like', async (req: any, res) => {
  try {
    await prisma.like.delete({
      where: {
        userId_blogId: {
          userId: req.userId,
          blogId: req.params.id,
        },
      },
    });
    const count = await prisma.like.count({ where: { blogId: req.params.id } });
    res.json({ count });
  } catch (error) {
    res.status(400).json({ error: 'Not liked or error' });
  }
});

// Comments
router.post('/:id/comments', async (req: any, res) => {
  try {
    const { content } = z.object({ content: z.string().min(1) }).parse(req.body);
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.userId,
        blogId: req.params.id,
      },
      include: {
        user: { select: { email: true } },
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

export default router;
