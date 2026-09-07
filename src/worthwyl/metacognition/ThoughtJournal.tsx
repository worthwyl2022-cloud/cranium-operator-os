import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Filter,
  Search,
  Tag,
  Flame,
  Shield,
  Bookmark,
  Sparkles,
  Layers,
  Lock,
  Compass,
  HeartPulse,
  Trash2,
  Edit3,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  X,
  Sliders,
  BarChart2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { ThoughtJournalEntry, CognitiveFocusArea } from '../../types/creativeOs';
import {
  INITIAL_THOUGHT_JOURNAL_ENTRIES,
  COGNITIVE_FOCUS_OPTIONS,
  PRIMARY_EMOTION_PRESETS,
} from './trackerData';

interface ThoughtJournalProps {
  onEntryLogged?: (entry: ThoughtJournalEntry) => void;
}

export default function ThoughtJournal({ onEntryLogged }: ThoughtJournalProps) {
  // Local storage persistence
  const [entries, setEntries] = useState<ThoughtJournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('worthwyl_thought_journal_logs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved thought journal logs:', e);
    }
    return INITIAL_THOUGHT_JOURNAL_ENTRIES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('worthwyl_thought_journal_logs', JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to persist thought journal logs:', e);
    }
  }, [entries]);

  // Form & UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(entries[0]?.id || null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFocusFilter, setSelectedFocusFilter] = useState<string>('all');
  const [intensityFilter, setIntensityFilter] = useState<'all' | 'calm' | 'moderate' | 'high' | 'peak'>('all');

  // New/Edit Entry Form State
  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIntensity, setFormIntensity] = useState<number>(7);
  const [formPrimaryEmotion, setFormPrimaryEmotion] = useState<string>('Fierce Conviction');
  const [customEmotionInput, setCustomEmotionInput] = useState('');
  const [formFocus, setFormFocus] = useState<CognitiveFocusArea>('Creative Sovereignty');
  const [formTags, setFormTags] = useState<string>('');
  const [formInsight, setFormInsight] = useState('');
  const [formDirective, setFormDirective] = useState('');

  // Quick Templates
  const applyTemplate = (templateName: 'sovereignty' | 'friction' | 'canon' | 'evening') => {
    setIsFormOpen(true);
    if (templateName === 'sovereignty') {
      setFormTitle('Auditing Compromise: Standing Firm on Sovereignty');
      setFormFocus('Creative Sovereignty');
      setFormIntensity(8);
      setFormPrimaryEmotion('Fierce Conviction');
      setFormTags('Boundary Setting, Dilution Resistance, Unapologetic Posture');
      setFormContent('Where did I notice the instinct to dilute or soften my voice today to satisfy external comfort? Detail the situation, the internal contraction, and the sovereign decision to hold ground:');
      setFormInsight('Conviction does not require external consensus to be valid.');
      setFormDirective('State the constraint without preemptive justification.');
    } else if (templateName === 'friction') {
      setFormTitle('Conflict as Signal: Deconstructing Creative Tension');
      setFormFocus('Conflict as Signal');
      setFormIntensity(7);
      setFormPrimaryEmotion('Restless Friction');
      setFormTags('Narrative Truth, High Tension, Resonance Substrate');
      setFormContent('What unresolved friction emerged in the work or team dialogue today? Rather than treating this friction as an error to extinguish, explore what signal it is generating:');
      setFormInsight('Tension is the structural lattice of genuine creative resonance.');
      setFormDirective('Refuse to smooth over the paradox; write through the tension.');
    } else if (templateName === 'canon') {
      setFormTitle('Canon Integrity & Memory Permanence Audit');
      setFormFocus('Canon Integrity');
      setFormIntensity(6);
      setFormPrimaryEmotion('Steady Groundedness');
      setFormTags('Memory Permanence, World Rules, Narrative Consistency');
      setFormContent('Reviewing recent narrative beats against the immutable canon. Have any themes or character arcs drifted from established emotional reality?');
      setFormInsight('A world without permanent memory ceases to carry consequences.');
      setFormDirective('Protect the quarantine boundary before committing to long-term memory.');
    } else {
      setFormTitle('Daily Metacognitive Log: Evening Intentionality Check');
      setFormFocus('Identity & Voice');
      setFormIntensity(5);
      setFormPrimaryEmotion('Lucid Clarity');
      setFormTags('Self-Reflection, Daily Practice, Sovereign Center');
      setFormContent('Daily check-in: Did I act from my sovereign center today or was I reacting to external demands? What was the most emotionally charged moment, and how did I direct my attention?');
      setFormInsight('Clarity is maintained by daily observation, not occasional panic.');
      setFormDirective('Rest the cognitive field; resume with clear focus tomorrow.');
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTitle('');
    setFormContent('');
    setFormIntensity(7);
    setFormPrimaryEmotion('Fierce Conviction');
    setCustomEmotionInput('');
    setFormFocus('Creative Sovereignty');
    setFormTags('');
    setFormInsight('');
    setFormDirective('');
    setEditingEntryId(null);
  };

  // Start Editing Entry
  const handleStartEdit = (entry: ThoughtJournalEntry) => {
    setEditingEntryId(entry.id);
    setFormDate(entry.date);
    setFormTitle(entry.title);
    setFormContent(entry.content);
    setFormIntensity(entry.emotionalIntensity);
    setFormPrimaryEmotion(entry.primaryEmotion);
    setFormFocus(entry.cognitiveFocus as CognitiveFocusArea);
    setFormTags(entry.secondaryFocusTags.join(', '));
    setFormInsight(entry.reframingInsight || '');
    setFormDirective(entry.actionDirective || '');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save / Submit Entry
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const chosenEmotion = customEmotionInput.trim() || formPrimaryEmotion;
    const parsedTags = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingEntryId) {
      // Update existing
      const updated = entries.map(item => {
        if (item.id === editingEntryId) {
          return {
            ...item,
            date: formDate,
            title: formTitle.trim(),
            content: formContent.trim(),
            emotionalIntensity: formIntensity,
            primaryEmotion: chosenEmotion,
            cognitiveFocus: formFocus,
            secondaryFocusTags: parsedTags.length > 0 ? parsedTags : [formFocus],
            reframingInsight: formInsight.trim() || undefined,
            actionDirective: formDirective.trim() || undefined,
          };
        }
        return item;
      });
      setEntries(updated);
      setSaveToast('Thought Journal entry updated successfully.');
    } else {
      // Create new
      const newEntry: ThoughtJournalEntry = {
        id: `journal-${Date.now()}`,
        date: formDate,
        timestamp: Date.now(),
        title: formTitle.trim(),
        content: formContent.trim(),
        emotionalIntensity: formIntensity,
        primaryEmotion: chosenEmotion,
        cognitiveFocus: formFocus,
        secondaryFocusTags: parsedTags.length > 0 ? parsedTags : [formFocus],
        reframingInsight: formInsight.trim() || undefined,
        actionDirective: formDirective.trim() || undefined,
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      setSaveToast('New daily metacognitive log recorded in local memory.');
      if (onEntryLogged) {
        onEntryLogged(newEntry);
      }
    }

    resetForm();
    setIsFormOpen(false);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Delete Entry
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Delete this daily metacognitive log from local state?')) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      if (expandedEntryId === id) {
        setExpandedEntryId(updated[0]?.id || null);
      }
      setSaveToast('Log entry removed from local state.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `worthwyl-thought-journal-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    let md = `# WorthWyl Creative OS — Metacognitive Thought Journal\n\n`;
    md += `*Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n\n`;
    md += `Total Entries: ${entries.length}\n\n---\n\n`;

    entries.forEach(entry => {
      md += `## [${entry.date}] ${entry.title}\n`;
      md += `**Cognitive Focus:** ${entry.cognitiveFocus} | **Emotional Intensity:** ${entry.emotionalIntensity}/10 | **Primary Emotion:** ${entry.primaryEmotion}\n`;
      md += `**Tags:** ${entry.secondaryFocusTags.join(', ')}\n\n`;
      md += `### Metacognitive Log\n${entry.content}\n\n`;
      if (entry.reframingInsight) {
        md += `> **Reframing Insight:** ${entry.reframingInsight}\n\n`;
      }
      if (entry.actionDirective) {
        md += `> **Action Directive:** ${entry.actionDirective}\n\n`;
      }
      md += `---\n\n`;
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `worthwyl-thought-journal-${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered entries calculation
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Focus filter
      if (selectedFocusFilter !== 'all' && entry.cognitiveFocus !== selectedFocusFilter) {
        return false;
      }

      // Intensity filter
      if (intensityFilter === 'calm' && entry.emotionalIntensity > 3) return false;
      if (intensityFilter === 'moderate' && (entry.emotionalIntensity < 4 || entry.emotionalIntensity > 6)) return false;
      if (intensityFilter === 'high' && (entry.emotionalIntensity < 7 || entry.emotionalIntensity > 8)) return false;
      if (intensityFilter === 'peak' && entry.emotionalIntensity < 9) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesContent = entry.content.toLowerCase().includes(q);
        const matchesEmotion = entry.primaryEmotion.toLowerCase().includes(q);
        const matchesTags = entry.secondaryFocusTags.some(t => t.toLowerCase().includes(q));
        const matchesInsight = entry.reframingInsight?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesContent && !matchesEmotion && !matchesTags && !matchesInsight) {
          return false;
        }
      }

      return true;
    });
  }, [entries, selectedFocusFilter, intensityFilter, searchQuery]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    if (entries.length === 0) {
      return { avgIntensity: 0, topFocus: 'None', highIntensityCount: 0 };
    }
    const sumIntensity = entries.reduce((acc, curr) => acc + curr.emotionalIntensity, 0);
    const avg = (sumIntensity / entries.length).toFixed(1);

    const focusCounts: Record<string, number> = {};
    entries.forEach(e => {
      focusCounts[e.cognitiveFocus] = (focusCounts[e.cognitiveFocus] || 0) + 1;
    });

    let topFocus = 'None';
    let maxCount = -1;
    Object.entries(focusCounts).forEach(([k, v]) => {
      if (v > maxCount) {
        maxCount = v;
        topFocus = k;
      }
    });

    const highCount = entries.filter(e => e.emotionalIntensity >= 7).length;

    return {
      avgIntensity: avg,
      topFocus,
      highIntensityCount: highCount,
    };
  }, [entries]);

  // Helper for intensity colors
  const getIntensityBadge = (val: number) => {
    if (val >= 9) {
      return {
        bg: 'bg-red-500/20 text-red-300 border-red-500/30',
        bar: 'bg-red-500',
        label: 'Peak Surge (9-10)',
      };
    }
    if (val >= 7) {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        bar: 'bg-amber-500',
        label: 'High Tension (7-8)',
      };
    }
    if (val >= 4) {
      return {
        bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        bar: 'bg-blue-500',
        label: 'Moderate (4-6)',
      };
    }
    return {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bar: 'bg-emerald-500',
      label: 'Calm / Grounded (1-3)',
    };
  };

  return (
    <div id="thought-journal-component" className="space-y-6">
      {/* Toast Alert */}
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveToast}</span>
          </div>
          <button
            onClick={() => setSaveToast(null)}
            className="text-emerald-400 hover:text-emerald-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner & Analytical Overview */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Metacognitive Thought Journal
              </span>
              <span className="text-xs text-neutral-400 font-mono">LOCAL STATE PERSISTENT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Daily Metacognitive Stream & Cognitive Audit
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
              Record daily observations of internal thought mechanics, tagged with real-time emotional intensity (1–10) and targeted cognitive focus. All entries are stored locally with zero cloud leakage.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              id="thought-journal-new-entry-btn"
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition shadow-sm"
            >
              {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isFormOpen ? 'Close Editor' : 'Record Daily Log'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Export all logs as JSON"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              title="Export formatted Markdown for Obsidian or notes"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
              Total Logs Recorded
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-mono font-bold text-white">{entries.length}</span>
              <span className="text-[11px] text-neutral-400">Daily Reflections</span>
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
              Avg. Emotional Intensity
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-mono font-bold text-amber-400">{metrics.avgIntensity}</span>
              <span className="text-[11px] text-neutral-400">/ 10 Scale</span>
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
              Primary Cognitive Focus
            </span>
            <div className="flex items-center gap-1.5 mt-1 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-neutral-200 truncate">{metrics.topFocus}</span>
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
              High Tension Logs (≥7)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-mono font-bold text-red-400">{metrics.highIntensityCount}</span>
              <span className="text-[11px] text-neutral-400">Crucible Moments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Template Launchers */}
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick Metacognitive Audit Templates
          </span>
          <span className="text-[11px] text-neutral-400 hidden sm:inline">Click to pre-fill sovereign framework</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => applyTemplate('sovereignty')}
            className="text-left p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Sovereignty Audit</span>
            </div>
            <p className="text-[11px] text-neutral-400 line-clamp-2">
              Catch impulses to dilute or apologize; defend creative authority.
            </p>
          </button>

          <button
            onClick={() => applyTemplate('friction')}
            className="text-left p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Conflict as Signal</span>
            </div>
            <p className="text-[11px] text-neutral-400 line-clamp-2">
              Transform uncomfortable friction into narrative or architectural fuel.
            </p>
          </button>

          <button
            onClick={() => applyTemplate('canon')}
            className="text-left p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Canon Integrity</span>
            </div>
            <p className="text-[11px] text-neutral-400 line-clamp-2">
              Audit episodic drift against foundational narrative world-truth.
            </p>
          </button>

          <button
            onClick={() => applyTemplate('evening')}
            className="text-left p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Evening Alignment</span>
            </div>
            <p className="text-[11px] text-neutral-400 line-clamp-2">
              Decompress cognitive tension; record high-impact insights of the day.
            </p>
          </button>
        </div>
      </div>

      {/* RECORD / EDIT FORM DRAWER */}
      {isFormOpen && (
        <div className="bg-neutral-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                {editingEntryId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {editingEntryId ? 'Edit Daily Thought Log' : 'Record New Daily Metacognitive Log'}
                </h4>
                <p className="text-xs text-neutral-400">
                  Tag internal thought patterns by affective intensity & cognitive focus
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(false);
              }}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-5">
            {/* Date and Title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Log Date</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs font-mono focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormDate(new Date().toISOString().split('T')[0])}
                    className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-[11px] whitespace-nowrap font-medium transition"
                  >
                    Today
                  </button>
                </div>
              </div>

              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Log Headline / Cognitive Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="E.g., Holding Sovereign Memory Permanence Against External Simplification..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition font-medium"
                  required
                />
              </div>
            </div>

            {/* Emotional Intensity Slider & Primary Emotion */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              {/* Emotional Intensity (1 to 10) */}
              <div className="md:col-span-6 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Emotional Intensity Level</span>
                  </label>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getIntensityBadge(formIntensity).bg}`}>
                    {formIntensity} / 10 &bull; {getIntensityBadge(formIntensity).label}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={formIntensity}
                  onChange={e => setFormIntensity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />

                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>1 (Calm/Latent)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Crucible Surge)</span>
                </div>
              </div>

              {/* Primary Emotion Selection */}
              <div className="md:col-span-6 space-y-2">
                <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Primary Affective State / Emotion</span>
                </label>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {PRIMARY_EMOTION_PRESETS.map(emotion => (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => {
                        setFormPrimaryEmotion(emotion);
                        setCustomEmotionInput('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                        formPrimaryEmotion === emotion && !customEmotionInput
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={customEmotionInput}
                  onChange={e => setCustomEmotionInput(e.target.value)}
                  placeholder="Or enter custom emotion (e.g., Relentless Focus)..."
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Cognitive Focus Area Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cognitive Focus Area</span>
                </span>
                <span className="text-[11px] text-neutral-400">Select the primary lens of your observation</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COGNITIVE_FOCUS_OPTIONS.map(opt => (
                  <button
                    key={opt.area}
                    type="button"
                    onClick={() => setFormFocus(opt.area)}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      formFocus === opt.area
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate flex items-center gap-1.5 text-neutral-200">
                      {opt.area === 'Creative Sovereignty' && <Shield className="w-3 h-3 text-amber-400 shrink-0" />}
                      {opt.area === 'Canon Integrity' && <Bookmark className="w-3 h-3 text-blue-400 shrink-0" />}
                      {opt.area === 'Identity & Voice' && <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />}
                      {opt.area === 'Conflict as Signal' && <Flame className="w-3 h-3 text-orange-400 shrink-0" />}
                      {opt.area === 'Narrative Architecture' && <Layers className="w-3 h-3 text-indigo-400 shrink-0" />}
                      {opt.area === 'Boundary Setting' && <Lock className="w-3 h-3 text-red-400 shrink-0" />}
                      {opt.area === 'Strategic Posture' && <Compass className="w-3 h-3 text-purple-400 shrink-0" />}
                      {opt.area === 'Emotional Regulation' && <HeartPulse className="w-3 h-3 text-pink-400 shrink-0" />}
                      <span className="truncate">{opt.area}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-tight">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Thought Reflection Stream */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Daily Metacognitive Log & Narrative Reflection <span className="text-amber-400">*</span></span>
                <span className="text-[11px] text-neutral-400">Describe the trigger, the internal reaction, and the sovereign reality</span>
              </label>
              <textarea
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                rows={5}
                placeholder="What happened today? What was the unconscious thought or impulse that arose? Did you self-censor or stand firm? Express the raw cognitive reality without corporate polish..."
                className="w-full px-3.5 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition leading-relaxed font-sans"
                required
              />
            </div>

            {/* Secondary Tags, Reframing Insight & Action Directive */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Secondary Focus Tags (comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  placeholder="e.g. Memory Permanence, Boundary Defense, Non-Linear Pacing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-amber-500 transition font-mono"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reframing Insight (Optional Key Takeaway)</span>
                </label>
                <input
                  type="text"
                  value={formInsight}
                  onChange={e => setFormInsight(e.target.value)}
                  placeholder="e.g. Apologies for depth are unconscious trades of authority for safety."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Action Directive (Next Sovereign Move)</span>
                </label>
                <input
                  type="text"
                  value={formDirective}
                  onChange={e => setFormDirective(e.target.value)}
                  placeholder="e.g. State the benchmark once; decline the invitation to overexplain."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{editingEntryId ? 'Update Thought Log' : 'Save Daily Thought Log'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reflections, tags, titles..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* Cognitive Focus Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedFocusFilter}
              onChange={e => setSelectedFocusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs focus:outline-none focus:border-amber-500 transition"
            >
              <option value="all">All Focus Areas</option>
              {COGNITIVE_FOCUS_OPTIONS.map(o => (
                <option key={o.area} value={o.area}>
                  {o.area}
                </option>
              ))}
            </select>
          </div>

          {/* Emotional Intensity Filter */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <span className="text-[10px] font-mono text-neutral-400 px-1.5">INTENSITY:</span>
            <button
              onClick={() => setIntensityFilter('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                intensityFilter === 'all' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setIntensityFilter('calm')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                intensityFilter === 'calm' ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="1-3 Calm / Latent"
            >
              1-3
            </button>
            <button
              onClick={() => setIntensityFilter('moderate')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                intensityFilter === 'moderate' ? 'bg-blue-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="4-6 Moderate"
            >
              4-6
            </button>
            <button
              onClick={() => setIntensityFilter('high')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                intensityFilter === 'high' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="7-8 High Tension"
            >
              7-8
            </button>
            <button
              onClick={() => setIntensityFilter('peak')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                intensityFilter === 'peak' ? 'bg-red-500 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="9-10 Peak Surge"
            >
              9-10
            </button>
          </div>
        </div>
      </div>

      {/* JOURNAL ENTRIES LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>
            SHOWING {filteredEntries.length} OF {entries.length} RECORDED THOUGHT LOGS
          </span>
          {(searchQuery || selectedFocusFilter !== 'all' || intensityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFocusFilter('all');
                setIntensityFilter('all');
              }}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-300">No matching metacognitive logs found</h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Try adjusting your search query, clearing filters, or logging a new thought entry for today.
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Log</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredEntries.map(entry => {
              const isExpanded = expandedEntryId === entry.id;
              const intensityInfo = getIntensityBadge(entry.emotionalIntensity);

              return (
                <div
                  key={entry.id}
                  className={`bg-neutral-900 rounded-2xl border transition shadow-xs ${
                    isExpanded ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Entry Header */}
                  <div
                    onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Date badge */}
                        <span className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 border border-neutral-800 text-[11px] font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {entry.date}
                        </span>

                        {/* Cognitive Focus Badge */}
                        <span className="px-2.5 py-0.5 rounded-md bg-neutral-800 text-neutral-200 text-[11px] font-semibold flex items-center gap-1">
                          <Compass className="w-3 h-3 text-amber-400" />
                          {entry.cognitiveFocus}
                        </span>

                        {/* Emotional Intensity Meter */}
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border flex items-center gap-1.5 ${intensityInfo.bg}`}>
                          <Flame className="w-3 h-3 shrink-0" />
                          Intensity {entry.emotionalIntensity}/10
                        </span>

                        {/* Primary Emotion Pill */}
                        <span className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-400 text-[11px] border border-neutral-800/80">
                          {entry.primaryEmotion}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white tracking-tight pt-0.5">
                        {entry.title}
                      </h4>

                      {!isExpanded && (
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {entry.content}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleStartEdit(entry);
                        }}
                        title="Edit Log"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        title="Delete Log"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-900/60 text-neutral-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-1.5 text-neutral-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-neutral-800/80 space-y-4">
                      {/* Full Log Content */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">
                          Metacognitive Stream
                        </span>
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                          {entry.content}
                        </div>
                      </div>

                      {/* Emotional & Cognitive Matrix */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Reframing Insight */}
                        {entry.reframingInsight && (
                          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1">
                            <span className="text-amber-400 font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> Reframing Insight
                            </span>
                            <p className="text-neutral-300 text-xs leading-relaxed italic">
                              "{entry.reframingInsight}"
                            </p>
                          </div>
                        )}

                        {/* Action Directive */}
                        {entry.actionDirective && (
                          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-1">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                              <ArrowRight className="w-3.5 h-3.5" /> Sovereign Action Directive
                            </span>
                            <p className="text-neutral-300 text-xs leading-relaxed font-semibold">
                              {entry.actionDirective}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tags Bar */}
                      {entry.secondaryFocusTags && entry.secondaryFocusTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-neutral-400 font-mono mr-1">TAGS:</span>
                          {entry.secondaryFocusTags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-mono border border-neutral-700/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
