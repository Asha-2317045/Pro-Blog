import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Plus, Trash2, Edit3, Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', content: '', isPublished: false });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['my-blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newBlog: any) => api.post('/blogs', newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      setIsCreating(false);
      setFormData({ title: '', content: '', isPublished: false });
      toast.success('Blog created!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/blogs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      setEditingBlog(null);
      toast.success('Blog updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      toast.success('Blog deleted');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, content: blog.content, isPublished: blog.isPublished });
    setIsCreating(true);
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        {!isCreating && (
          <button
            onClick={() => { setIsCreating(true); setEditingBlog(null); setFormData({ title: '', content: '', isPublished: false }); }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Blog
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
            <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-zinc-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
              <textarea
                required
                rows={10}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black/5 font-mono text-sm"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-black text-white py-2 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 bg-zinc-100 text-zinc-900 py-2 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {blogs?.map((blog: any) => (
          <div key={blog.id} className="bg-white p-6 rounded-2xl border border-black/5 flex items-center justify-between group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{blog.title}</h3>
                {blog.isPublished ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Published</span>
                ) : (
                  <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Draft</span>
                )}
              </div>
              <p className="text-xs text-zinc-500">Last updated {format(new Date(blog.updatedAt), 'MMM d, yyyy')}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to={`/blog/${blog.slug}`} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600" title="View Public">
                <Eye className="w-4 h-4" />
              </Link>
              <button onClick={() => startEdit(blog)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600" title="Edit">
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { if(confirm('Delete this blog?')) deleteMutation.mutate(blog.id); }} 
                className="p-2 hover:bg-red-50 rounded-lg text-red-600" 
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {blogs?.length === 0 && !isCreating && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300">
            <p className="text-zinc-500">You haven't written any blogs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
