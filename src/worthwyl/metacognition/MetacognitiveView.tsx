import { useState, FormEvent } from 'react';
import { 
  Brain, Plus, Calendar, Activity, CheckSquare, Sparkles, 
  Tag, Download, ArrowRight, Check, AlertCircle, ShieldAlert,
  Flame, HelpCircle, FileText, ChevronDown, ChevronUp, Clock, Info, BookOpen
} from 'lucide-react';
import { MetacognitiveEntry, MetacognitiveReview } from '../../types/creativeOs';
import { INITIAL_METACOGNITIVE_ENTRIES, INITIAL_REVIEWS, REFLECTION_QUESTIONS } from './trackerData';
import ThoughtJournal from './ThoughtJournal';

interface MetacognitiveViewProps {
  onExportSummary?: () => void;
}

export default function MetacognitiveView({ onExportSummary }: MetacognitiveViewProps = {}) {
  const [activeTab, setActiveTab] = useState<'today' | 'journal' | 'history' | 'patterns' | 'reviews'>('today');
  const [entries, setEntries] = useState<MetacognitiveEntry[]>(() => {
    const saved = localStorage.getItem('worthwyl_metacognitive_entries');
    return saved ? JSON.parse(saved) : INITIAL_METACOGNITIVE_ENTRIES;
  });

  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // Form State for Today's Quick Capture
  const [situation, setSituation] = useState('');
  const [trigger, setTrigger] = useState('');
  const [thought, setThought] = useState('');
  const [assumption, setAssumption] = useState('');
  const [emotion, setEmotion] = useState('');
  const [confidence, setConfidence] = useState(60);
  const [intensity, setIntensity] = useState(6);
  const [awarenessLevel, setAwarenessLevel] = useState(8);
  const [actionTaken, setActionTaken] = useState('');
  const [outcome, setOutcome] = useState('');
  const [selfEditing, setSelfEditing] = useState(false);
  const [shrankSelf, setShrankSelf] = useState(false);
  const [engagedTrueSelf, setEngagedTrueSelf] = useState(true);
  const [walkedAway, setWalkedAway] = useState(false);
  const [overexplained, setOverexplained] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !thought.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // Pick dynamic reflection question
    const randomPrompt = REFLECTION_QUESTIONS[Math.floor(Math.random() * REFLECTION_QUESTIONS.length)];

    const newEntry: MetacognitiveEntry = {
      id: `meta-${Date.now()}`,
      createdAt: new Date().toISOString(),
      situation,
      trigger: trigger || 'Unspecified creative/stakeholder pressure',
      thought,
      assumption: assumption || 'Unchecked cognitive assumption',
      emotion: emotion || 'Neutral focus',
      confidence,
      intensity,
      awareness_level: awarenessLevel,
      action_taken: actionTaken || 'Recorded observation',
      outcome: outcome || 'Reflecting on behavioral impact',
      self_editing: selfEditing,
      shrank_self: shrankSelf,
      engaged_true_self: engagedTrueSelf,
      walked_away: walkedAway,
      overexplained: overexplained,
      tags: tagsArray.length > 0 ? tagsArray : ['Self-Reflection'],
      suggestedPrompt: randomPrompt
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('worthwyl_metacognitive_entries', JSON.stringify(updated));

    // Reset form
    setSituation('');
    setTrigger('');
    setThought('');
    setAssumption('');
    setEmotion('');
    setActionTaken('');
    setOutcome('');
    setTagsInput('');
    setFormStep(1);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Pattern Statistics Calculations
  const totalEntries = entries.length;
  const shrankCount = entries.filter(e => e.shrank_self).length;
  const overexplainedCount = entries.filter(e => e.overexplained).length;
  const engagedCount = entries.filter(e => e.engaged_true_self).length;
  const selfEditingCount = entries.filter(e => e.self_editing).length;

  const shrankRate = totalEntries > 0 ? Math.round((shrankCount / totalEntries) * 100) : 0;
  const overexplainedRate = totalEntries > 0 ? Math.round((overexplainedCount / totalEntries) * 100) : 0;
  const engagedRate = totalEntries > 0 ? Math.round((engagedCount / totalEntries) * 100) : 0;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `worthwyl-metacognitive-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Subsystem Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
              <Brain className="w-3 h-3" /> Metacognitive Subsystem
            </span>
            <span className="text-xs text-neutral-400 font-mono">PRIVATE SELF-AWARENESS ENGINE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Metacognitive Tracker</h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
            Make unconscious creative thinking visible. Audit where you shrink, overexplain, avoid, or engage your authentic sovereign voice.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'today'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today (Capture)
          </button>
          <button
            id="metacognitive-thought-journal-tab"
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'journal'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thought Journal</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'history'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            History ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'patterns'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Patterns
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Weekly Review
          </button>
        </div>
      </div>

      {/* TAB: THOUGHT JOURNAL */}
      {activeTab === 'journal' && (
        <ThoughtJournal />
      )}

      {/* TAB 1: TODAY (QUICK-CAPTURE GUIDED FORM) */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Quick Guided Check-In</h3>
                <p className="text-xs text-neutral-400">Takes under 60 seconds to make thoughts tangible.</p>
              </div>

              {/* Steps indicator */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormStep(s as 1 | 2 | 3 | 4)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition ${
                      formStep === s
                        ? 'bg-amber-500 text-neutral-950'
                        : formStep > s
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Entry logged to local metacognitive memory. Patterns updated.</span>
              </div>
            )}

            <form onSubmit={handleSaveEntry} className="space-y-4">
              {/* STEP 1: SITUATION & TRIGGER */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      1. The Situation <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="E.g., Pitching our cognitive physics architecture to an executive investor..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      2. The Specific Trigger
                    </label>
                    <input
                      type="text"
                      value={trigger}
                      onChange={(e) => setTrigger(e.target.value)}
                      placeholder="E.g., Partner questioned why we didn't just use standard RAG..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      disabled={!situation.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition"
                    >
                      <span>Next: Thought & Assumption</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: THOUGHT & ASSUMPTION */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      3. Automatic Thought <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      value={thought}
                      onChange={(e) => setThought(e.target.value)}
                      placeholder="What automatic sentence ran through your head?"
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      4. Underlying Assumption or Belief
                    </label>
                    <input
                      type="text"
                      value={assumption}
                      onChange={(e) => setAssumption(e.target.value)}
                      placeholder="E.g., If I stand firm, they will think I am difficult or eccentric..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      disabled={!thought.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition"
                    >
                      <span>Next: Emotion & Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: EMOTION, ACTION & CONFIDENCE */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Emotion / Bodily Feeling
                      </label>
                      <input
                        type="text"
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        placeholder="E.g., Anxious hesitation, defensive tension..."
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Confidence in Belief ({confidence}%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={confidence}
                        onChange={(e) => setConfidence(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Action Taken
                    </label>
                    <input
                      type="text"
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      placeholder="What did you actually say or do in response?"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Actual Outcome
                    </label>
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      placeholder="What was the tangible result?"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(4)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition"
                    >
                      <span>Next: Behavioral Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SELF-AWARENESS AUDIT (THE FIVE CRITICAL TOGGLES) */}
              {formStep === 4 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Self-Awareness Audit</span>
                    <p className="text-xs text-neutral-400">
                      Did you shrink or stand in your sovereignty? Honest calibration here is what builds genuine creative power.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Shrank Self</div>
                        <div className="text-[11px] text-neutral-400">Did you play smaller, downplay capability, or silence your insight?</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={shrankSelf}
                        onChange={(e) => setShrankSelf(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Overexplained</div>
                        <div className="text-[11px] text-neutral-400">Did you justify, rationalize, or audition for reassurance?</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={overexplained}
                        onChange={(e) => setOverexplained(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Self-Editing / Censored</div>
                        <div className="text-[11px] text-neutral-400">Did you preemptively soften conflict or alter your truth to please others?</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selfEditing}
                        onChange={(e) => setSelfEditing(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Engaged True Self</div>
                        <div className="text-[11px] text-neutral-400">Did you show up with full conviction, poise, and dignity?</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={engagedTrueSelf}
                        onChange={(e) => setEngagedTrueSelf(e.target.checked)}
                        className="w-4 h-4 accent-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Walked Away</div>
                        <div className="text-[11px] text-neutral-400">Did you physically or emotionally abandon the situation?</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={walkedAway}
                        onChange={(e) => setWalkedAway(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Investor Pitch, Writing Canon, Team Review..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition shadow-lg shadow-amber-500/10"
                    >
                      <Check className="w-4 h-4" />
                      <span>Commit to Metacognitive Memory</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Quick Stats & Prompts Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-4">
              <div className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                Real-Time Behavioral Pulse
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Engaged True Self</span>
                    <span className="font-mono text-emerald-400 font-bold">{engagedRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${engagedRate}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Overexplaining Rate</span>
                    <span className="font-mono text-amber-400 font-bold">{overexplainedRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${overexplainedRate}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Self-Shrinking Rate</span>
                    <span className="font-mono text-red-400 font-bold">{shrankRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${shrankRate}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-neutral-300 space-y-1.5">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Metacognitive Directive
                </span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  "Notice the physical contraction right before you justify. That contraction is your signal to stop speaking."
                </p>
              </div>

              {/* Jump to Thought Journal */}
              <div 
                onClick={() => setActiveTab('journal')}
                className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 transition">
                    <BookOpen className="w-3.5 h-3.5" /> Daily Thought Journal
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition" />
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Record structured daily reflections tagged by emotional intensity & cognitive focus.
                </p>
              </div>
            </div>

            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Export Raw Logs</span>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-xs text-neutral-200 hover:bg-neutral-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORY TIMELINE */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>{entries.length} CHRONOLOGICAL OBSERVATIONS RECORDED</span>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              <Download className="w-3.5 h-3.5" /> Export All
            </button>
          </div>

          <div className="space-y-3">
            {entries.map((entry) => {
              const isExpanded = expandedEntryId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-xs font-mono text-neutral-400">
                        {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-amber-400">
                        Conf: {entry.confidence}%
                      </span>
                    </div>

                    {/* Behavioral Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.engaged_true_self && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          True Self
                        </span>
                      )}
                      {entry.shrank_self && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                          Shrank
                        </span>
                      )}
                      {entry.overexplained && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Overexplained
                        </span>
                      )}
                      {entry.self_editing && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Self-Edited
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{entry.situation}</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      "{entry.thought}"
                    </p>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-neutral-800/80 space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <span className="text-[10px] font-mono uppercase text-neutral-500">TRIGGER:</span>
                          <p className="text-neutral-300 mt-0.5">{entry.trigger}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <span className="text-[10px] font-mono uppercase text-neutral-500">UNDERLYING ASSUMPTION:</span>
                          <p className="text-neutral-300 mt-0.5">{entry.assumption}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <span className="text-[10px] font-mono uppercase text-neutral-500">ACTION TAKEN:</span>
                          <p className="text-neutral-300 mt-0.5">{entry.action_taken}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <span className="text-[10px] font-mono uppercase text-neutral-500">OUTCOME:</span>
                          <p className="text-neutral-300 mt-0.5">{entry.outcome}</p>
                        </div>
                      </div>

                      {entry.suggestedPrompt && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-neutral-300">
                          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">REFLECTION INQUIRY:</span>
                          <p className="text-neutral-200 mt-0.5 italic">{entry.suggestedPrompt}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                    >
                      <span>{isExpanded ? 'Less' : 'Inspect Audit'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PATTERNS & ANALYTICS */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">TOTAL OBSERVATIONS</span>
              <div className="text-3xl font-bold font-mono text-white mt-1">{totalEntries}</div>
              <p className="text-[11px] text-neutral-500 mt-1">Sufficient for behavioral synthesis</p>
            </div>
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
              <span className="text-xs font-mono text-emerald-400">AUTHENTIC CONVICTION</span>
              <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">{engagedRate}%</div>
              <p className="text-[11px] text-neutral-500 mt-1">High creative sovereignty</p>
            </div>
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
              <span className="text-xs font-mono text-amber-400">OVEREXPLAIN RATE</span>
              <div className="text-3xl font-bold font-mono text-amber-400 mt-1">{overexplainedRate}%</div>
              <p className="text-[11px] text-neutral-500 mt-1">Auditioning for validation</p>
            </div>
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
              <span className="text-xs font-mono text-red-400">SELF-SHRINKING RATE</span>
              <div className="text-3xl font-bold font-mono text-red-400 mt-1">{shrankRate}%</div>
              <p className="text-[11px] text-neutral-500 mt-1">Downplaying vision around status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
              <div className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                Synthesized Behavioral Insights
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>The Status Trigger Phenomenon</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    When in contact with institutional authority (investors, senior engineers), your self-shrinking rate jumps from 0% (in private work) to 66%. You preemptively assume they want generic solutions, abandoning the proprietary cognitive physics contract.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Check className="w-4 h-4" />
                    <span>Creative Conviction in Deep Flow</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    When writing or structuring story canon alone, your conviction is above 85%. You reject cheap generic solutions and embrace psychological tension as productive energy.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
              <div className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                Recurring Cognitive Distortions
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Mind-Reading Authority</span>
                  <span className="font-mono text-amber-400">High Frequency</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Premature Conflict Softening</span>
                  <span className="font-mono text-amber-400">Moderate Frequency</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Preemptive Overjustification</span>
                  <span className="font-mono text-red-400">Critical Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEEKLY REVIEW */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {INITIAL_REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase font-semibold">SYNTHESIS REVIEW</span>
                  <h3 className="text-lg font-bold text-white">{rev.periodLabel}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {rev.period.toUpperCase()} CADENCE
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                {rev.summary}
              </p>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Prescribed Testable Experiment for Coming Week
                </div>
                <p className="text-sm text-white font-medium italic">
                  "{rev.testableExperiment}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Shrink Rate</div>
                  <div className="text-xl font-bold font-mono text-red-400 mt-0.5">{rev.shrinkRate}%</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Overexplain Rate</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{rev.overexplainRate}%</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Authentic Conviction</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{rev.engagedRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
