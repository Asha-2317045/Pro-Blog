import express from 'express';
import { prisma } from './db';

const router = express.Router();

// Public Feed
router.get('/feed', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where: { isPublished: true },
      include: {
        user: { select: { email: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blog.count({ where: { isPublished: true } }),
  ]);

  res.json({
    blogs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

// Public Blog by Slug
router.get('/blogs/:slug', async (req, res) => {
  const blog = await prisma.blog.findUnique({
    where: { slug: req.params.slug },
    include: {
      user: { select: { email: true } },
      _count: { select: { likes: true, comments: true } },
      comments: {
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!blog || !blog.isPublished) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.json(blog);
});

export default router;
