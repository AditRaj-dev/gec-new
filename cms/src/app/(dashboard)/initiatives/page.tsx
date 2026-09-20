'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Initiative, InitiativeStatus, InitiativeStage, InitiativeFaq } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import { AssetPickerModal } from '../../../components/media/AssetPickerModal';
import {
  Rocket,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
  X,
  Upload,
} from 'lucide-react';
import { cn, formatDate } from '../../../lib/utils';

export default function InitiativesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingInit, setEditingInit] = useState<Initiative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'overview' | 'stepper' | 'eligibility' | 'faqs'>('overview');
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Initiative>>({
    title: '',
    slug: '',
    cohortId: '',
    category: 'Program',
    status: 'Applications Open',
    featuredOnHome: false,
    excerpt: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    stages: [
      { stageNum: '01', title: 'Stage 1: Application', targetDates: 'Oct 01 – 15', description: 'Screening round', status: 'current' },
      { stageNum: '02', title: 'Stage 2: Bootcamp', targetDates: 'Oct 20 – Nov 10', description: 'Mentorship', status: 'upcoming' },
      { stageNum: '03', title: 'Stage 3: Prototype', targetDates: 'Nov 15 – Dec 01', description: 'Build MVP', status: 'upcoming' },
      { stageNum: '04', title: 'Stage 4: Demo Day', targetDates: 'Dec 15', description: 'Pitch to VCs', status: 'upcoming' },
    ],
    eligibility: ['Open to all students with active enrollment.', 'Prototype or MVP required.'],
    mentors: ['Dr. Vikramaditya Sen', 'Rohan Gupta'],
    speakers: [],
    faqs: [
      { question: 'What is the commitment level?', answer: 'Founders must attend weekly progress checkpoints.' },
    ],
    ctaLabel: 'Apply Now',
    ctaUrl: '/forms/apply',
    customFormFields: [],
  });

  const loadInitiatives = () => {
    apiClient.getInitiatives().then(setInitiatives);
  };

  useEffect(() => {
    loadInitiatives();
  }, []);

  const handleOpenAdd = () => {
    setEditingInit(null);
    setFormData({
      title: '',
      slug: '',
      cohortId: `SDP-${new Date().getFullYear()}`,
      category: 'Program',
      status: 'Applications Open',
      featuredOnHome: false,
      excerpt: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      stages: [
        { stageNum: '01', title: 'Stage 1: Application', targetDates: 'Dates', description: 'Screening', status: 'current' },
        { stageNum: '02', title: 'Stage 2: Bootcamp', targetDates: 'Dates', description: 'Mentoring', status: 'upcoming' },
        { stageNum: '03', title: 'Stage 3: Build', targetDates: 'Dates', description: 'MVP', status: 'upcoming' },
        { stageNum: '04', title: 'Stage 4: Pitch', targetDates: 'Dates', description: 'Demo Day', status: 'upcoming' },
      ],
      eligibility: ['Valid university ID required.'],
      mentors: [],
      speakers: [],
      faqs: [],
      ctaLabel: 'Apply Now',
      ctaUrl: '/forms/apply',
      customFormFields: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (init: Initiative) => {
    setEditingInit(init);
    setFormData(init);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingInit) {
      await apiClient.updateInitiative(editingInit.id, formData);
    } else {
      await apiClient.createInitiative(formData as any);
    }
    setIsModalOpen(false);
    loadInitiatives();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this initiative?')) {
      await apiClient.deleteInitiative(id);
      loadInitiatives();
    }
  };

  const filtered = initiatives.filter(init => {
    const matchesSearch = init.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || init.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Initiatives & Programs Studio
          </h1>
          <p className="text-xs text-[#6E655F]">
            Manage SDP cohorts, Ideathons, E-Summits, 4-stage steppers, eligibility, and FAQs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Initiative</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="Page 04 §4.1 Filter Strip, §4.2 Cards, and §4.3 Detail Stepper Canvas"
        description="Controls program cards, cohort milestones, eligibility checklists, FAQs, and primary application buttons."
      />

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDF8] p-3 rounded-xl border border-[#A3040F]/15">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search programs by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {['all', 'Applications Open', 'Ongoing', 'Coming Soon', 'Completed'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#A3040F] text-white font-bold'
                  : 'bg-[#FCF8ED] border border-[#CBD5E1] text-[#222222]'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Initiatives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(init => (
          <div
            key={init.id}
            className="bg-[#FFFDF8] border border-[#A3040F]/15 hover:border-[#A3040F] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="h-36 bg-[#F4E2CA] relative overflow-hidden">
                <img
                  src={init.coverImage}
                  alt={init.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow-xs',
                      init.status === 'Applications Open' && 'bg-[#16A34A] text-white',
                      init.status === 'Ongoing' && 'bg-[#1F7EC0] text-white',
                      init.status === 'Coming Soon' && 'bg-[#FBCA05] text-[#222222]',
                      init.status === 'Completed' && 'bg-[#6E655F] text-white'
                    )}
                  >
                    {init.status}
                  </span>
                  {init.featuredOnHome && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                      Home Pinned
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono text-[#6E655F] uppercase tracking-wider block">
                  {init.category} · {init.cohortId}
                </span>
                <h3 className="text-sm font-bold text-[#222222] leading-snug group-hover:text-[#A3040F] transition-colors">
                  {init.title}
                </h3>
                <p className="text-xs text-[#6E655F] line-clamp-2">
                  {init.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#E2E8F0] mt-2 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[#6E655F]">
                {init.submissionsCount} Submissions
              </span>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(init)}
                  className="p-1.5 rounded text-[#6E655F] hover:text-[#A3040F] hover:bg-[#F4E2CA]/50 transition-colors cursor-pointer"
                  title="Edit initiative"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(init.id)}
                  className="p-1.5 rounded text-[#6E655F] hover:text-[#991B1B] hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete initiative"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Initiative Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#A3040F]/20 p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 shrink-0">
              <h3 className="text-sm font-bold text-[#222222]">
                {editingInit ? `Edit ${editingInit.title}` : 'Configure New Initiative'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#6E655F] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 bg-[#FCF8ED] p-1 rounded-xl border border-[#CBD5E1] text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setActiveEditorTab('overview')}
                className={`px-3 py-1 rounded-lg ${
                  activeEditorTab === 'overview' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F]'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('stepper')}
                className={`px-3 py-1 rounded-lg ${
                  activeEditorTab === 'stepper' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F]'
                }`}
              >
                4-Stage Timeline Stepper
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('eligibility')}
                className={`px-3 py-1 rounded-lg ${
                  activeEditorTab === 'eligibility' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F]'
                }`}
              >
                Eligibility
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('faqs')}
                className={`px-3 py-1 rounded-lg ${
                  activeEditorTab === 'faqs' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F]'
                }`}
              >
                FAQs
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {activeEditorTab === 'overview' && (
                <>
                  <div>
                    <label className="block font-bold text-[#222222] mb-1">Initiative Title *</label>
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
                      <label className="block font-bold text-[#222222] mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                      >
                        <option value="Program">Incubation Program</option>
                        <option value="Competition">Competition / Hackathon</option>
                        <option value="Workshop">Hands-on Workshop</option>
                        <option value="Summit">Flagship Summit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#222222] mb-1">Status Badge</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-bold"
                      >
                        <option value="Coming Soon">Coming Soon</option>
                        <option value="Applications Open">Applications Open</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#222222] mb-1">Excerpt (Summary)</label>
                    <textarea
                      rows={2}
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#222222] mb-1">Cover Image (16:9)</label>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#222222] mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={formData.ctaLabel}
                        onChange={e => setFormData({ ...formData, ctaLabel: e.target.value })}
                        className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#222222] mb-1">CTA Target URL / Route</label>
                      <input
                        type="text"
                        value={formData.ctaUrl}
                        onChange={e => setFormData({ ...formData, ctaUrl: e.target.value })}
                        className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeEditorTab === 'stepper' && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FCF8ED] border border-[#A3040F]/15 rounded-xl">
                    <h4 className="font-bold text-[#A3040F] uppercase tracking-wider font-mono">
                      4 Progression Stages Stepper (Page 04 §4.3)
                    </h4>
                  </div>
                  {(formData.stages || []).map((stage, idx) => (
                    <div key={idx} className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-2">
                      <span className="font-mono font-bold text-[#A3040F] text-[11px]">
                        STAGE 0{idx + 1}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Stage Title"
                          value={stage.title}
                          onChange={e => {
                            const newStages = [...(formData.stages || [])];
                            newStages[idx].title = e.target.value;
                            setFormData({ ...formData, stages: newStages });
                          }}
                          className="p-1.5 border border-[#CBD5E1] rounded-lg font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Target Dates"
                          value={stage.targetDates}
                          onChange={e => {
                            const newStages = [...(formData.stages || [])];
                            newStages[idx].targetDates = e.target.value;
                            setFormData({ ...formData, stages: newStages });
                          }}
                          className="p-1.5 border border-[#CBD5E1] rounded-lg"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Description / Milestones"
                        value={stage.description}
                        onChange={e => {
                          const newStages = [...(formData.stages || [])];
                          newStages[idx].description = e.target.value;
                          setFormData({ ...formData, stages: newStages });
                        }}
                        className="w-full p-1.5 border border-[#CBD5E1] rounded-lg text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeEditorTab === 'eligibility' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#222222]">Eligibility Criteria List</h4>
                  {(formData.eligibility || []).map((crit, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={crit}
                        onChange={e => {
                          const newEl = [...(formData.eligibility || [])];
                          newEl[idx] = e.target.value;
                          setFormData({ ...formData, eligibility: newEl });
                        }}
                        className="flex-1 p-2 bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        eligibility: [...(formData.eligibility || []), 'New requirement criterion'],
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#A3040F] text-[#A3040F] font-bold"
                  >
                    + Add Criterion
                  </button>
                </div>
              )}

              {activeEditorTab === 'faqs' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#222222]">Frequently Asked Questions</h4>
                  {(formData.faqs || []).map((faq, idx) => (
                    <div key={idx} className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={e => {
                          const newFaqs = [...(formData.faqs || [])];
                          newFaqs[idx].question = e.target.value;
                          setFormData({ ...formData, faqs: newFaqs });
                        }}
                        className="w-full p-1.5 border border-[#CBD5E1] rounded-lg font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={e => {
                          const newFaqs = [...(formData.faqs || [])];
                          newFaqs[idx].answer = e.target.value;
                          setFormData({ ...formData, faqs: newFaqs });
                        }}
                        className="w-full p-1.5 border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        faqs: [...(formData.faqs || []), { question: '', answer: '' }],
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#A3040F] text-[#A3040F] font-bold"
                  >
                    + Add FAQ Pair
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2 shrink-0">
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
                  Save Initiative
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
        title="Select Initiative Cover (16:9)"
      />
    </div>
  );
}
