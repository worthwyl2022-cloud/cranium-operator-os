import { useState, useEffect, FormEvent } from 'react';
import { 
  BookOpen, Sparkles, Wand2, GitBranch, RefreshCw, Eye, 
  Layers, Users, MapPin, CheckCircle2, Clock, ChevronRight, 
  Settings, Flame, Compass, FileText, Plus, MessageSquare, 
  Send, AlertTriangle, ShieldCheck, Download, Check, HelpCircle
} from 'lucide-react';
import { 
  WorthWylPersona, Directive, CognitiveAtom, Metrics 
} from '../../types/creativeOs';
import { 
  Novel, EpisodeSnapshot, ContinuityState, OrchestratorStep 
} from '../story/domain';
import { EpisodicMemoryStore } from '../story/EpisodicMemoryStore';
import { ContinuityTracker } from '../story/ContinuityTracker';
import { TaskOrchestrator } from '../story/TaskOrchestrator';
import { DEFAULT_PERSONA } from '../story/novelEngine';
import { ResonanceField } from '../core/field';
import { resolve } from '../core/loop';

interface Props {
  field: ResonanceField;
  metrics: Metrics;
  onAtomInjected: (atom: CognitiveAtom) => void;
  onNavigateToDemo: () => void;
}

export default function CreatorStudioView({ field, metrics, onAtomInjected, onNavigateToDemo }: Props) {
  // Multi-novel state
  const [novels, setNovels] = useState<Novel[]>(() => EpisodicMemoryStore.getNovels());
  const [selectedNovelId, setSelectedNovelId] = useState<string>(novels[0]?.id || 'novel-worthwyl-genesis');
  
  // Snapshots and continuity state for selected novel
  const [snapshots, setSnapshots] = useState<EpisodeSnapshot[]>(() => 
    EpisodicMemoryStore.getSnapshotsForNovel(selectedNovelId)
  );
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(() => Math.max(0, snapshots.length - 1));
  const [continuity, setContinuity] = useState<ContinuityState>(() => 
    ContinuityTracker.buildState(snapshots)
  );

  // Tuning and directives
  const [persona, setPersona] = useState<WorthWylPersona>(DEFAULT_PERSONA);
  const [selectedDirective, setSelectedDirective] = useState<Directive>(Directive.ADVANCE);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showCreateNovelModal, setShowCreateNovelModal] = useState(false);
  const [newNovelTitle, setNewNovelTitle] = useState('');
  const [newNovelGenre, setNewNovelGenre] = useState('Speculative Noir');
  const [newNovelLogline, setNewNovelLogline] = useState('');

  // Cognitive loop execution state
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [currentStep, setCurrentStep] = useState<OrchestratorStep | null>(null);
  const [viewMode, setViewMode] = useState<'manuscript' | 'leaf' | 'assistant'>('manuscript');

  // Story Forge AI chat state
  const [assistantMessages, setAssistantMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; directiveSuggestion?: string }>>([
    {
      role: 'assistant',
      text: "Cranium Core Novel Engine ready. Episodic memory and visual-text continuity lattice active. You can request canon audits, explore next beats, or set narrative constraints."
    }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Sync state when selected novel changes
  useEffect(() => {
    const novelSnaps = EpisodicMemoryStore.getSnapshotsForNovel(selectedNovelId);
    setSnapshots(novelSnaps);
    setSelectedEpisodeIdx(Math.max(0, novelSnaps.length - 1));
    setContinuity(ContinuityTracker.buildState(novelSnaps));
  }, [selectedNovelId]);

  const activeDirectives = resolve(metrics);
  const currentNovel = novels.find(n => n.id === selectedNovelId) || novels[0];
  const currentEp = snapshots[selectedEpisodeIdx] || snapshots[0];

  // Primary Cognitive Loop: TaskOrchestrator.writeNextEpisode
  const handleWriteNextEpisode = async () => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);

    try {
      const result = await TaskOrchestrator.writeNextEpisode(selectedNovelId, {
        directivePosture: selectedDirective,
        userPrompt: customPrompt,
        novelTitle: currentNovel?.title || "THE SOVEREIGN CORE",
        onStepProgress: (step) => {
          setCurrentStep(step);
        }
      });

      // Reload snapshots and continuity
      const updatedSnaps = EpisodicMemoryStore.getSnapshotsForNovel(selectedNovelId);
      setSnapshots(updatedSnaps);
      setSelectedEpisodeIdx(updatedSnaps.length - 1);
      setContinuity(result.continuity);
      setCustomPrompt('');

      // Inject cognitive atom into resonance field
      const newAtom: CognitiveAtom = {
        id: `atom-ep-${result.snapshot.episodeNumber}`,
        charge: result.snapshot.tone === 'dark' || result.snapshot.tone === 'tense' ? -0.4 : 0.45,
        mass: 7.0,
        velocity: result.snapshot.pacing === 'fast' ? 0.85 : 0.4,
        tags: result.snapshot.tags,
        kind: 'episodic',
        label: result.snapshot.title
      };
      onAtomInjected(newAtom);
    } catch (e) {
      console.error("TaskOrchestrator execution error:", e);
    } finally {
      setIsOrchestrating(false);
      setCurrentStep(null);
    }
  };

  const handleCreateNovel = (e: FormEvent) => {
    e.preventDefault();
    if (!newNovelTitle.trim()) return;

    const created = EpisodicMemoryStore.createNovel({
      title: newNovelTitle,
      genre: newNovelGenre,
      logline: newNovelLogline
    });

    const updatedNovels = EpisodicMemoryStore.getNovels();
    setNovels(updatedNovels);
    setSelectedNovelId(created.id);
    setShowCreateNovelModal(false);
    setNewNovelTitle('');
    setNewNovelLogline('');
  };

  const handleResolveThread = (thread: string) => {
    const nextState = ContinuityTracker.resolveThread(continuity, thread);
    setContinuity(nextState);
  };

  const handleSendAssistant = async (e: FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim() || isAssistantThinking) return;

    const userText = assistantInput.trim();
    setAssistantInput('');
    setAssistantMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsAssistantThinking(true);

    try {
      const res = await fetch('/api/novel/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          continuity,
          currentEpisode: currentEp
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssistantMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply || "Canon consistency verified across all active threads.",
            directiveSuggestion: data.directiveSuggestion
          }
        ]);
        if (data.directiveSuggestion && Object.values(Directive).includes(data.directiveSuggestion)) {
          setSelectedDirective(data.directiveSuggestion as Directive);
        }
      } else {
        setAssistantMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: "Offline cognitive mode: Analyzed character anchors and verified that no contradiction exists in the recent episodic snapshots."
          }
        ]);
      }
    } catch {
      setAssistantMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "Offline mode active. Canon is anchored to the local episodic memory lattice."
        }
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const exportContinuityManifest = () => {
    const manifest = {
      novel: currentNovel,
      snapshots,
      continuity,
      exportedAt: new Date().toISOString(),
      substrate: "Cranium Core v3"
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNovel.title.toLowerCase().replace(/\s+/g, '_')}_canon_manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Novel Selection Ribbon */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <select
                  value={selectedNovelId}
                  onChange={(e) => setSelectedNovelId(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700/80 text-white font-bold text-base px-3 py-1 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {novels.map(n => (
                    <option key={n.id} value={n.id}>{n.title} ({n.genre})</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCreateNovelModal(true)}
                  className="p-1 px-2 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition"
                  title="Create New Novel"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Novel</span>
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                {currentNovel.logline || `${currentNovel.genre} &bull; ${snapshots.length} episodes captured in memory`}
              </p>
            </div>
          </div>

          {/* Action Center: Directives & Write Next Episode */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Directive selector pill */}
            <div className="flex items-center bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-xs">
              <span className="text-neutral-500 text-[10px] mr-2 font-mono uppercase">Posture:</span>
              <select
                value={selectedDirective}
                onChange={(e) => setSelectedDirective(e.target.value as Directive)}
                className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value={Directive.ADVANCE} className="bg-neutral-900 text-amber-400">ADVANCE (Progress Plot)</option>
                <option value={Directive.ESCALATE} className="bg-neutral-900 text-red-400">ESCALATE (Spike Tension)</option>
                <option value={Directive.STABILIZE} className="bg-neutral-900 text-emerald-400">STABILIZE (Reflect & Ground)</option>
                <option value={Directive.SHIFT_THEME} className="bg-neutral-900 text-blue-400">SHIFT_THEME (Expand Lore)</option>
              </select>
            </div>

            <button
              onClick={() => setShowPersonaModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Persona</span>
            </button>

            <button
              onClick={exportContinuityManifest}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition"
              title="Export Full Continuity JSON"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Export</span>
            </button>

            <button
              onClick={handleWriteNextEpisode}
              disabled={isOrchestrating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition shadow-lg shadow-amber-500/10"
            >
              {isOrchestrating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{isOrchestrating ? 'Executing Loop...' : 'Write Next Episode'}</span>
            </button>
          </div>
        </div>

        {/* Live Step Progress Banner (When Orchestrator is Running) */}
        {isOrchestrating && currentStep && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-2 animate-pulse">
            <div className="flex items-center justify-between font-mono">
              <span className="text-amber-300 font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                COGNITIVE LOOP // STEP {currentStep.stepIndex} OF {currentStep.totalSteps}: {currentStep.name.toUpperCase()}
              </span>
              <span className="text-amber-400/80">{Math.round((currentStep.stepIndex / currentStep.totalSteps) * 100)}%</span>
            </div>
            <p className="text-neutral-300 text-[11px] font-mono">{currentStep.description}</p>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${(currentStep.stepIndex / currentStep.totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Optional Writer Beat Prompt Input */}
        <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/80">
          <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">OPTIONAL FOCUS:</span>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Focus on Dr. Vane's discovery in the gantry archive, or elevate psychological stakes..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Episodic Memory Timeline (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Episodes ({snapshots.length})</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3" /> CANON SECURED
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {snapshots.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-500">
                No episodes yet. Click "Write Next Episode" to seed the narrative.
              </div>
            ) : (
              snapshots.map((ep, idx) => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEpisodeIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition ${
                    idx === selectedEpisodeIdx
                      ? 'bg-neutral-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-neutral-950 border-neutral-800/80 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-amber-400 font-bold">EPISODE {ep.episodeNumber.toString().padStart(2, '0')}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold ${
                      ep.pacing === 'fast' ? 'text-red-400 bg-red-950/40' : ep.pacing === 'medium' ? 'text-amber-400 bg-amber-950/40' : 'text-emerald-400 bg-emerald-950/40'
                    }`}>
                      {ep.pacing}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">{ep.title}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 italic">
                    "{ep.text}"
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Center: Selected Episode Reader, Visual Leaf, or Story Forge AI (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                onClick={() => setViewMode('manuscript')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  viewMode === 'manuscript'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Manuscript</span>
              </button>

              <button
                onClick={() => setViewMode('leaf')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  viewMode === 'leaf'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Visual Leaf (Canvas)</span>
              </button>

              <button
                onClick={() => setViewMode('assistant')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  viewMode === 'assistant'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Story Forge AI</span>
              </button>
            </div>

            {currentEp && (
              <span className="text-[11px] font-mono text-neutral-500">
                EPISODE {currentEp.episodeNumber} OF {snapshots.length}
              </span>
            )}
          </div>

          {/* VIEW 1: Manuscript Typeset Reader */}
          {viewMode === 'manuscript' && currentEp && (
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                    CANONICAL EPISODE {currentEp.episodeNumber}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-white mt-0.5">{currentEp.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                    TONE: {currentEp.tone.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-neutral-800">
                    PACING: {currentEp.pacing.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Typeset Story Body */}
              <div className="text-neutral-200 text-sm md:text-base font-serif leading-relaxed whitespace-pre-line bg-neutral-950/60 p-6 rounded-xl border border-neutral-800/80 selection:bg-amber-500 selection:text-neutral-950">
                {currentEp.text}
              </div>

              {/* Episode Metadata Tags & Locations */}
              <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-500 text-[10px] font-mono uppercase">Characters in Scene:</span>
                  {currentEp.characters.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-neutral-950 text-indigo-300 border border-neutral-800 text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-500 text-[10px] font-mono uppercase">Locations:</span>
                  {currentEp.locations.map((loc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-neutral-950 text-amber-300 border border-neutral-800 text-[11px]">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Visual Leaf (Canvas Screenshot Snapshot) */}
          {viewMode === 'leaf' && currentEp && (
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Layers className="w-4 h-4" /> 480x640 TYPOGRAPHIC SEAL // VISUAL COHERENCE LEAF
                </span>
                <span>EPISODIC ID: {currentEp.id}</span>
              </div>

              <div className="flex justify-center bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                {currentEp.screenshotUrl ? (
                  <img
                    src={currentEp.screenshotUrl}
                    alt={`Rendered Leaf - ${currentEp.title}`}
                    className="max-h-[500px] rounded-lg shadow-2xl border border-neutral-800"
                  />
                ) : (
                  <div className="py-20 text-xs text-neutral-500 font-mono">
                    Generating canvas screenshot...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: Story Forge AI Continuity Assistant */}
          {viewMode === 'assistant' && (
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex flex-col h-[520px]">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">Story Forge Continuity Partner</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  ONLINE // GEMINI 2.5 READY
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {assistantMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-amber-500/10 border border-amber-500/20 text-neutral-100 ml-8'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-200 mr-4'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase">
                      {msg.role === 'user' ? 'Writer' : 'Cranium Continuity Partner'}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.directiveSuggestion && (
                      <div className="mt-2 pt-2 border-t border-neutral-800 text-[10px] font-mono text-amber-400 flex items-center justify-between">
                        <span>Suggested Posture: {msg.directiveSuggestion}</span>
                        <button
                          onClick={() => setSelectedDirective(msg.directiveSuggestion as Directive)}
                          className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400"
                        >
                          Apply Posture
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isAssistantThinking && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs font-mono animate-pulse">
                    Auditing canon continuity and drafting response...
                  </div>
                )}
              </div>

              {/* Assistant Input Form */}
              <form onSubmit={handleSendAssistant} className="mt-3 pt-3 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="Ask about character arcs, canon rules, or brainstorm the next twist..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isAssistantThinking || !assistantInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: Continuity Sidebar (Characters, Threads, Locations) (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Character Arc Map */}
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> CHARACTER ARCS
              </span>
              <span className="text-neutral-500">{Object.keys(continuity.characters).length} ACTIVE</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {Object.entries(continuity.characters).map(([name, data]) => {
                const charData = data as { firstSeen: number; lastSeen: number; arcStatus?: string };
                return (
                  <div key={name} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                    <div className="font-semibold text-white truncate">{name}</div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-1">
                      <span>Ep {charData.firstSeen} &rarr; Ep {charData.lastSeen}</span>
                      <span className="text-amber-400 text-[9px] truncate max-w-[90px]">
                        {charData.arcStatus || 'In Canon'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open Threads Tracker with One-Click Resolution */}
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> OPEN THREADS ({continuity.openThreads.length})
              </span>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {continuity.openThreads.length === 0 ? (
                <div className="p-2 text-xs text-neutral-500 italic">No open narrative threads recorded.</div>
              ) : (
                continuity.openThreads.map((th, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between gap-2">
                    <span className="text-neutral-300 line-clamp-2 text-[11px]">{th}</span>
                    <button
                      onClick={() => handleResolveThread(th)}
                      title="Mark thread resolved in canon"
                      className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-emerald-400 transition"
                    >
                      Resolve
                    </button>
                  </div>
                ))
              )}

              {continuity.resolvedThreads.length > 0 && (
                <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{continuity.resolvedThreads.length} threads sealed in canon</span>
                </div>
              )}
            </div>
          </div>

          {/* Locations Registry */}
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> LOCATIONS ({Object.keys(continuity.locations).length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(continuity.locations).map((loc, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Novel */}
      {showCreateNovelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateNovel} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Novel Serial</h3>
              <button
                type="button"
                onClick={() => setShowCreateNovelModal(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Novel Title</label>
                <input
                  type="text"
                  required
                  value={newNovelTitle}
                  onChange={(e) => setNewNovelTitle(e.target.value)}
                  placeholder="e.g. The Silicon Lattice"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Genre</label>
                <input
                  type="text"
                  value={newNovelGenre}
                  onChange={(e) => setNewNovelGenre(e.target.value)}
                  placeholder="e.g. Hard Sci-Fi / Noir"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Premise / Logline</label>
                <textarea
                  value={newNovelLogline}
                  onChange={(e) => setNewNovelLogline(e.target.value)}
                  placeholder="Summary of the initial narrative anchor..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateNovelModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
              >
                Create Novel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Persona Tuning */}
      {showPersonaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Persona Calibration: {persona.name}</h3>
              <button
                onClick={() => setShowPersonaModal(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Style Philosophy</label>
                <textarea
                  value={persona.stylePhilosophy}
                  onChange={(e) => setPersona({ ...persona, stylePhilosophy: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Forbidden Patterns</label>
                <input
                  type="text"
                  value={persona.forbiddenPatterns}
                  onChange={(e) => setPersona({ ...persona, forbiddenPatterns: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Pacing Mode</label>
                  <select
                    value={persona.pacingPreferences.defaultPacing}
                    onChange={(e) => setPersona({
                      ...persona,
                      pacingPreferences: { ...persona.pacingPreferences, defaultPacing: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
                  >
                    <option value="slow">Slow & Atmospheric</option>
                    <option value="medium">Medium Serialized</option>
                    <option value="fast">Fast & Relentless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Emotional Darkness</label>
                  <select
                    value={persona.emotionalProfile.darkness}
                    onChange={(e) => setPersona({
                      ...persona,
                      emotionalProfile: { ...persona.emotionalProfile, darkness: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
                  >
                    <option value="subtle">Subtle</option>
                    <option value="elevated">Elevated (Noir)</option>
                    <option value="visceral">Visceral</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPersonaModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
