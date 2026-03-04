import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart } from 'lucide-react';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    summary: string | null;
    slug: string;
    createdAt: string;
    user: { email: string };
    _count: { likes: number; comments: number };
  };
}

export default function BlogCard({ blog }: any) {
  return (
    <Link 
      to={`/blog/${blog.slug}`}
      className="group block p-6 bg-white border border-black/5 rounded-2xl hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <span className="font-medium text-zinc-900">{blog.user.email.split('@')[0]}</span>
            <span>•</span>
            <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-black transition-colors leading-tight">
            {blog.title}
          </h3>
        </div>
        
        {blog.summary && (
          <p className="text-zinc-600 text-sm line-clamp-2 leading-relaxed">
            {blog.summary}
          </p>
        )}
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Heart className="w-4 h-4" />
            <span>{blog._count.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MessageSquare className="w-4 h-4" />
            <span>{blog._count.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
