import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { format } from 'date-fns';
import { Heart, MessageSquare, Send, ChevronLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get(`/public/blogs/${slug}`);
      return data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => api.post(`/blogs/${blog.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
      toast.success('Liked!');
    },
    onError: () => toast.error('Already liked or error'),
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => api.post(`/blogs/${blog.id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
      setComment('');
      toast.success('Comment added');
    },
  });

  if (isLoading) return <div className="max-w-2xl mx-auto animate-pulse space-y-8">
    <div className="h-12 bg-white rounded-xl w-3/4" />
    <div className="h-64 bg-white rounded-3xl" />
  </div>;

  if (isError) return <div className="text-center py-20">
    <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
    <Link to="/feed" className="text-black font-medium hover:underline">Back to feed</Link>
  </div>;

  return (
    <article className="max-w-2xl mx-auto">
      <Link to="/feed" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to feed
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600">
            {blog.user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-zinc-900">{blog.user.email}</p>
            <p className="text-xs text-zinc-500">{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </header>

      <div className="prose prose-zinc max-w-none mb-16 whitespace-pre-wrap text-zinc-800 leading-relaxed text-lg">
        {blog.content}
      </div>

      <footer className="border-t border-black/5 pt-12 space-y-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => user ? likeMutation.mutate() : toast.error('Login to like')}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 hover:bg-white transition-colors group"
          >
            <Heart className={`w-5 h-5 ${likeMutation.isPending ? 'animate-ping' : ''} group-hover:text-red-500 transition-colors`} />
            <span className="font-medium">{blog._count.likes}</span>
          </button>
          <div className="flex items-center gap-2 text-zinc-500">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{blog._count.comments}</span>
          </div>
        </div>

        <section className="space-y-8">
          <h3 className="text-xl font-bold">Comments</h3>
          
          {user ? (
            <div className="flex gap-4">
              <input
                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && comment.trim() && commentMutation.mutate(comment)}
              />
              <button 
                onClick={() => comment.trim() && commentMutation.mutate(comment)}
                disabled={commentMutation.isPending || !comment.trim()}
                className="p-2 bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 bg-zinc-100 p-4 rounded-xl text-center">
              <Link to="/login" className="text-black font-bold hover:underline">Login</Link> to join the conversation.
            </p>
          )}

          <div className="space-y-6">
            {blog.comments.map((c: any) => (
              <div key={c.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{c.user.email.split('@')[0]}</span>
                  <span className="text-[10px] text-zinc-400">{format(new Date(c.createdAt), 'MMM d')}</span>
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed">{c.content}</p>
              </div>
            ))}
            {blog.comments.length === 0 && (
              <p className="text-center py-8 text-zinc-400 text-sm italic">No comments yet. Be the first!</p>
            )}
          </div>
        </section>
      </footer>
    </article>
  );
}
