'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Story, StoryCategory, StoryStatus } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import { AssetPickerModal } from '../../../components/media/AssetPickerModal';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Pin,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { cn, formatDate } from '../../../lib/utils';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Story>>({
    title: '',
    slug: '',
    category: 'Founder Story',
    status: 'Draft',
    author: 'Editorial Desk',
    authorRole: 'GEC Content Lead',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop&q=80',
    excerpt: '',
    body: '',
    quote: '',
    featuredOnHome: false,
    featuredOnMagazineLead: false,
  });

  const loadStories = () => {
    apiClient.getStories().then(setStories);
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleOpenAdd = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Founder Story',
      status: 'Draft',
      author: 'Sneha Patel',
      authorRole: 'Editorial Head',
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop&q=80',
      excerpt: '',
      body: '',
      quote: '',
      featuredOnHome: false,
      featuredOnMagazineLead: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story: Story) => {
    setEditingStory(story);
    setFormData(story);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingStory) {
      await apiClient.updateStory(editingStory.id, formData);
    } else {
      await apiClient.createStory(formData as any);
    }
    setIsModalOpen(false);
    loadStories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      await apiClient.deleteStory(id);
      loadStories();
    }
  };

  const filtered = stories.filter(story => {
    const matchesSearch =
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      story.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Stories & Editorial Desk
          </h1>
          <p className="text-xs text-[#6E655F]">
            News, Founder Stories, Startup Case Studies, Event Recaps, and Homepage Bento placements.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write Story</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="Page 01 §1.2 Bento Grid (Slot 1) & Page 05 §5.1–§5.3 Magazine Spread"
        description="Controls featured story cards, founder pull quotes, author metadata, and magazine lead editorial pins."
      />

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDF8] p-3 rounded-xl border border-[#A3040F]/15">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search stories by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
          />
        </div>

        {/* Category & Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {['all', 'Founder Story', 'News', 'Startup Story', 'Event Story'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#A3040F] text-white font-bold'
                  : 'bg-[#FCF8ED] border border-[#CBD5E1] text-[#222222]'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(story => (
          <div
            key={story.id}
            className="bg-[#FFFDF8] border border-[#A3040F]/15 hover:border-[#A3040F] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="h-40 bg-[#F4E2CA] relative overflow-hidden">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow-xs',
                      story.status === 'Published' && 'bg-[#16A34A] text-white',
                      story.status === 'In Review' && 'bg-[#D97706] text-white',
                      story.status === 'Draft' && 'bg-[#6E655F] text-white',
                      story.status === 'Scheduled' && 'bg-[#1F7EC0] text-white'
                    )}
                  >
                    {story.status}
                  </span>
                  {story.featuredOnHome && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#A3040F] text-white flex items-center gap-0.5">
                      <Pin className="w-2.5 h-2.5" /> Bento 01
                    </span>
                  )}
                  {story.featuredOnMagazineLead && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FBCA05] text-[#222222] flex items-center gap-0.5">
                      Magazine Lead
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#6E655F]">
                  <span className="uppercase text-[#A3040F] font-bold">{story.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {story.readTime}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#222222] leading-snug group-hover:text-[#A3040F] transition-colors">
                  {story.title}
                </h3>

                <p className="text-xs text-[#6E655F] line-clamp-2">
                  {story.excerpt}
                </p>

                {story.quote && (
                  <div className="bg-[#FCF8ED] p-2.5 rounded-lg border-l-2 border-[#FBCA05] text-[11px] italic text-[#222222]">
                    "{story.quote}"
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#E2E8F0] mt-2 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6E655F]">
                By {story.author} · {formatDate(story.publishedAt)}
              </span>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(story)}
                  className="p-1.5 rounded text-[#6E655F] hover:text-[#A3040F] hover:bg-[#F4E2CA]/50 transition-colors cursor-pointer"
                  title="Edit story"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(story.id)}
                  className="p-1.5 rounded text-[#6E655F] hover:text-[#991B1B] hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete story"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write / Edit Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#A3040F]/20 p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 shrink-0">
              <h3 className="text-sm font-bold text-[#222222]">
                {editingStory ? 'Edit Editorial Story' : 'Draft New Story'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#6E655F] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1">
              <div>
                <label className="block font-bold text-[#222222] mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#222222] mb-1">Story Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as StoryCategory })}
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                  >
                    <option value="Founder Story">Founder Story</option>
                    <option value="News">News & Institutional Updates</option>
                    <option value="Startup Story">Startup Case Study</option>
                    <option value="Event Story">Event Recap</option>
                    <option value="Featured Story">Featured Pin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#222222] mb-1">Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as StoryStatus })}
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-bold"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review (Staff Check)</option>
                    <option value="Published">Published to Live Site</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#222222] mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#222222] mb-1">Author Role</label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={e => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#222222] mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Cover Image (16:9 or 3:4)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => setAssetPickerOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#FCF8ED] border border-[#A3040F]/30 text-xs font-semibold text-[#A3040F]"
                  >
                    Browse Media
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Lead Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Story Body Copy</label>
                <textarea
                  rows={5}
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Full editorial story paragraphs..."
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">
                  Founder Pull Quote (Rendered in Magazine Spread Page 05 §5.3)
                </label>
                <input
                  type="text"
                  value={formData.quote || ''}
                  onChange={e => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Inspiring quote from founder..."
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg italic"
                />
              </div>

              {/* Homepage Pin Controls */}
              <div className="p-3 bg-[#FCF8ED] border border-[#A3040F]/20 rounded-xl space-y-2">
                <span className="font-mono font-bold text-[#A3040F] uppercase text-[10px]">
                  Homepage Placement Toggles
                </span>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featuredOnHome}
                      onChange={e => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                      className="rounded text-[#A3040F] focus:ring-[#A3040F]"
                    />
                    <span className="font-semibold text-[#222222]">Pin to Homepage Bento Slot 1</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featuredOnMagazineLead}
                      onChange={e => setFormData({ ...formData, featuredOnMagazineLead: e.target.checked })}
                      className="rounded text-[#A3040F] focus:ring-[#A3040F]"
                    />
                    <span className="font-semibold text-[#222222]">Pin to Magazine Lead (Page 05 §5.2)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[#222222] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={cdnUrl => setFormData(prev => ({ ...prev, coverImage: cdnUrl }))}
        allowedCategories={['Images']}
        title="Select Story Cover Image"
      />
    </div>
  );
}
