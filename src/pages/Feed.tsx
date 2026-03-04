import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import BlogCard from '../components/BlogCard';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Feed() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['feed', page],
    queryFn: async () => {
      const { data } = await api.get(`/public/feed?page=${page}&limit=${limit}`);
      return data;
    },
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-white rounded-2xl border border-black/5" />
      ))}
    </div>
  );

  if (isError) return <div className="text-center py-20 text-red-500">Failed to load feed</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Public Feed</h1>
        <p className="text-zinc-500">Discover the latest stories from our community.</p>
      </div>

      {data.blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300">
          <p className="text-zinc-500">No blogs published yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.blogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog as any} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full border border-zinc-200 disabled:opacity-30 hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              Page {page} of {data.pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
              disabled={page === data.pagination.pages}
              className="p-2 rounded-full border border-zinc-200 disabled:opacity-30 hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
