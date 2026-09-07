import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, 
  ExternalLink, Sparkles, CheckCircle2, ShieldAlert, Cpu, 
  BookOpen, Brain, Server, ChevronRight, Layers, ArrowRight
} from 'lucide-react';
import { DEMO_CHAPTERS, DemoChapter } from './acquisitionDemoData';
import { Directive } from '../../types/creativeOs';

interface Props {
  onNavigateToModule: (module: 'studio' | 'tracker' | 'physics' | 'diligence') => void;
}

export default function AcquisitionVideoDemo({ onNavigateToModule }: Props) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressSec, setProgressSec] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'demo' | 'handover'>('demo');

  const chapter: DemoChapter = DEMO_CHAPTERS[currentChapterIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech synthesis voiceover support
  useEffect(() => {
    if (isVoiceEnabled && isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(chapter.narratorVoiceText);
      utterance.rate = playbackSpeed * 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else if (!isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentChapterIdx, isPlaying, isVoiceEnabled, playbackSpeed]);

  // Main playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgressSec((prev) => {
          const next = prev + 0.5 * playbackSpeed;
          if (next >= chapter.durationSec) {
            if (currentChapterIdx < DEMO_CHAPTERS.length - 1) {
              setCurrentChapterIdx(currentChapterIdx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return chapter.durationSec;
            }
          }
          return next;
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentChapterIdx, chapter.durationSec, playbackSpeed]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeekChapter = (idx: number) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentChapterIdx(idx);
    setProgressSec(0);
  };

  const handleRestart = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentChapterIdx(0);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const currentPercent = Math.min(100, Math.round((progressSec / chapter.durationSec) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 p-5 rounded-2xl border border-neutral-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Acquisition Diligence Walkthrough
            </span>
            <span className="text-xs text-neutral-400 font-mono">CONFIDENTIAL // WORTHWYL COGNITIVE CORE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Cranium Core & Creative OS Showcase
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
            An interactive executive walkthrough demonstrating the behavioral contract, cognitive physics, episodic narrative coherence, and metacognitive tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToModule('diligence')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition"
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            Diligence Room (.md)
          </button>
          <button
            onClick={() => onNavigateToModule('studio')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/10"
          >
            Open Live Studio
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Video Presentation Display Frame */}
      <div className="relative bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
        {/* Cinema Screen Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="font-mono text-neutral-300 font-semibold tracking-wide">
              {chapter.act}: {chapter.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>HD 60FPS // LIVE ENGINE SIMULATION</span>
            </div>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="p-6 md:p-8 min-h-[460px] flex flex-col justify-between bg-gradient-to-b from-neutral-950 via-neutral-900/40 to-neutral-950">
          {/* Main Stage Content By Chapter Visual Mode */}
          <div className="w-full">
            {chapter.visualMode === 'summary' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    FOUNDATIONAL MOAT
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight leading-snug">
                    Why Generative AI Fails Creative Long-Form & How Cranium Core Solves It.
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Most creative platforms operate as superficial wrappers over generative models. Over serialized narrative, character relationships disintegrate, emotional intensity flatlines, and canon suffers from catastrophic regression.
                  </p>
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <p className="text-xs font-mono text-amber-400 uppercase font-semibold">The Behavioral Contract</p>
                    <p className="text-xs text-neutral-300 italic">
                      "Intention &rarr; Identity &rarr; Memory Permanence &rarr; Conflict as Signal &rarr; Directive-Driven Next Move."
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 space-y-3.5">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Substrate Comparison</div>
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" /> Naive RAG / Chat Memory
                    </span>
                    <p className="text-xs text-neutral-400">Prone to narrative regression, drifting tone, and forgotten character boundaries after 3-5 episodes.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> WorthWyl Cranium Core Substrate
                    </span>
                    <p className="text-xs text-neutral-300">Resonance field physics with immutable constitutional canon, velocity dampening, and directive-governed next steps.</p>
                  </div>
                </div>
              </div>
            )}

            {chapter.visualMode === 'physics' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
                    <Cpu className="w-3.5 h-3.5" />
                    LIVE COGNITIVE RESONANCE PHYSICS
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Cognitive Atoms & Resonance Field
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Story events carry emotional mass, charge (-1.0 to 1.0), and velocity. The physics engine tracks non-linear dampening and collision penalties in real time.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-[11px] text-neutral-400 font-mono">COHERENCE</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">0.920</div>
                      <div className="text-[10px] text-neutral-500">Floor: 0.900</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-[11px] text-neutral-400 font-mono">TENSION</div>
                      <div className="text-xl font-bold text-amber-400 mt-1 font-mono">0.245</div>
                      <div className="text-[10px] text-neutral-500">Floor: 0.080</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-[11px] text-neutral-400 font-mono">CONTINUITY</div>
                      <div className="text-xl font-bold text-indigo-400 mt-1 font-mono">0.780</div>
                      <div className="text-[10px] text-neutral-500">Target: &gt;0.45</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-neutral-400 font-mono">GOVERNOR RESOLUTION:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      DIRECTIVE: {Directive.ADVANCE}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>ACTIVE FIELD ATOMS</span>
                    <span className="text-amber-400 font-semibold">4 REGISTERED</span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-200">The Silent Perimeter Breach</div>
                        <div className="text-[10px] text-neutral-500 font-mono">TAGS: isolation, subversion, telemetry</div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-amber-400 font-semibold">Charge: -0.65</span>
                        <div className="text-[10px] text-neutral-500">Mass: 8.5 | Vel: 0.70</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-200">Biometric Ledger Discrepancy</div>
                        <div className="text-[10px] text-neutral-500 font-mono">TAGS: conflict, technology, secrecy</div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-red-400 font-semibold">Charge: -0.40</span>
                        <div className="text-[10px] text-neutral-500">Mass: 6.0 | Vel: 0.85</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-200">Resonance Gantry Discovery</div>
                        <div className="text-[10px] text-neutral-500 font-mono">TAGS: meaning, space, coherence</div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-emerald-400 font-semibold">Charge: +0.70</span>
                        <div className="text-[10px] text-neutral-500">Mass: 9.0 | Vel: 0.50</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-950 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>Theme Drift Detection:</span>
                    <span className="text-emerald-400">0.052 / 0.350 (STABLE)</span>
                  </div>
                </div>
              </div>
            )}

            {chapter.visualMode === 'novel' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
                <div className="lg:col-span-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                    <BookOpen className="w-3.5 h-3.5" />
                    DUAL CORTEX STORY ENGINE
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Episodic Spine & Visual Memory
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Serialized writing requires visual and narrative coherence. The engine synthesizes recent memory snapshots, checks character conflict arcs, and tracks open vs resolved threads.
                  </p>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-300">Character Arc: Kaelan Thorne</span>
                      <span className="text-xs font-mono text-emerald-400">Ep 1 &rarr; Ep 3 (In Conflict)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-300">Character Arc: Dr. Mira Vane</span>
                      <span className="text-xs font-mono text-amber-400">Ep 1 &rarr; Ep 3 (Sovereign Motive)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-300">Open Threads</span>
                      <span className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 text-neutral-300 font-mono">2 Active // 1 Resolved</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-sm p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                      <span>CANVAS TYPOGRAPHY LEAF</span>
                      <span className="text-amber-400">EPISODE 03</span>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">WorthWyl OS // Novel Engine</span>
                      <h4 className="text-base font-serif font-bold text-white">Resonance Threshold</h4>
                      <div className="h-0.5 w-full bg-neutral-800"></div>
                      <p className="text-xs text-neutral-300 font-serif italic line-clamp-4 leading-relaxed">
                        "The archive did not contain files; it contained mirrors. Not physical glass, but harmonic resonant arrays that echoed back electromagnetic thought patterns before they were spoken aloud..."
                      </p>
                      <div className="flex gap-2 pt-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-neutral-800 text-neutral-400">TONE: REFLECTIVE</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-neutral-800 text-emerald-400">PACING: SLOW</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {chapter.visualMode === 'metacognitive' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
                <div className="lg:col-span-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                    <Brain className="w-3.5 h-3.5" />
                    HUMAN-IN-THE-LOOP SELF-AWARENESS
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    The Metacognitive Tracker
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Creators are prone to overthinking, hesitation, and shrinking around authority. The tracker captures cognitive distortions in under 60 seconds and surfaces behavioral patterns.
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                      <div className="font-semibold text-neutral-200">Observed Pattern (Last 7 Days)</div>
                      <p className="text-neutral-400">
                        "You tend to overexplain and self-shrink during high-stakes pitches, while working with 85% conviction when generating alone."
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                      <div className="font-semibold text-neutral-200">Recommended Micro-Experiment</div>
                      <p className="text-neutral-400 text-xs italic">
                        "Deliver your core technical axiom in one sentence. Hold 5 seconds of silence before answering follow-ups."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>SELF-EDITING BEHAVIORAL AUDIT</span>
                    <span className="text-emerald-400 font-semibold">3 LOGS ANALYZED</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-neutral-300">
                        <span>Engaged True Self (Authentic Conviction)</span>
                        <span className="font-mono text-emerald-400">67%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 text-neutral-300">
                        <span>Overexplained (Preemptive Justification)</span>
                        <span className="font-mono text-amber-400">40%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 text-neutral-300">
                        <span>Shrank Self (Diminished Stature)</span>
                        <span className="font-mono text-red-400">33%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '33%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
                    <span className="text-amber-400 font-semibold">Active Reflection Prompt: </span>
                    "What were you protecting yourself from when you abandoned the core physics demonstration?"
                  </div>
                </div>
              </div>
            )}

            {chapter.visualMode === 'architecture' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
                <div className="lg:col-span-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                    <Server className="w-3.5 h-3.5" />
                    ACQUISITION & PLATFORM READINESS
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Microsoft Azure Deployment Architecture
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Engineered to drop straight into Azure Kubernetes Service (AKS) with Istio service mesh, Redis caching, and Azure Cognitive Search.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="font-semibold text-neutral-200">Microservice Mesh</div>
                      <div className="text-[11px] text-neutral-400">Istio mTLS, traffic shaping, distributed tracing</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="font-semibold text-neutral-200">Miracle Archive</div>
                      <div className="text-[11px] text-neutral-400">AES-256 encrypted generational storage</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="font-semibold text-neutral-200">Clean IP & Chain of Title</div>
                      <div className="text-[11px] text-neutral-400">Zero third-party proprietary dependencies</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="font-semibold text-neutral-200">Copilot / Surface Ready</div>
                      <div className="text-[11px] text-neutral-400">Turnkey category expansion for Windows & Azure</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Cluster Topology (K8s)</div>
                  <div className="p-3 rounded-xl bg-neutral-950 font-mono text-xs text-neutral-300 space-y-1.5 border border-neutral-800">
                    <div className="text-amber-400 font-bold">Azure Front Door &rarr; API Gateway</div>
                    <div className="text-neutral-500 text-[11px] pl-2">├── /api/core/* &rarr; worthwyl-core (Cranium Engine)</div>
                    <div className="text-neutral-500 text-[11px] pl-2">├── /api/media/* &rarr; worthwyl-media (GPU Render Workers)</div>
                    <div className="text-neutral-500 text-[11px] pl-2">├── /api/legacy/* &rarr; worthwyl-legacy (Miracle Archive)</div>
                    <div className="text-neutral-500 text-[11px] pl-2">└── /studio/* &rarr; worthwyl-studio (BFF + UI)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-neutral-300">
                    <span className="text-emerald-400 font-bold">Diligence Summary: </span>
                    Ready for technical review. The acquisition opportunity is the proprietary behavioral contract, physics governance, and metacognitive architecture.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Metrics / Highlights Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 mt-6 border-t border-neutral-800/80">
            {chapter.keyHighlights.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/70">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-neutral-400">{item.label}</span>
                  <span className="font-mono text-sm font-bold text-amber-400">{item.metric}</span>
                </div>
                <p className="text-[11px] text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Subtitles Bar */}
        <div className="px-6 py-3 bg-neutral-900/95 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-amber-400 font-bold uppercase">
              SUBTITLES
            </span>
            <p className="italic text-neutral-200 line-clamp-1">
              {chapter.captions[Math.floor((progressSec / chapter.durationSec) * chapter.captions.length)] || chapter.captions[0]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono transition ${
                isVoiceEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isVoiceEnabled ? 'VOICEOVER: ON' : 'VOICEOVER: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800/80 space-y-3">
          {/* Progress bar with chapter milestone pins */}
          <div className="space-y-1.5">
            <div className="relative h-2 w-full bg-neutral-800 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${currentPercent}%` }}
              ></div>
            </div>

            {/* Chapter Pills */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {DEMO_CHAPTERS.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => handleSeekChapter(idx)}
                  className={`text-left p-1.5 rounded-lg border transition ${
                    idx === currentChapterIdx
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : idx < currentChapterIdx
                      ? 'bg-neutral-800/60 border-neutral-700 text-neutral-400'
                      : 'bg-neutral-950/40 border-neutral-800 text-neutral-500 hover:text-neutral-400'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold truncate">{c.act}</div>
                  <div className="text-[11px] truncate font-medium">{c.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-neutral-950" /> : <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                title="Restart Presentation"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 font-mono text-xs text-neutral-400 ml-2">
                <span>{Math.floor(progressSec)}s</span>
                <span>/</span>
                <span>{chapter.durationSec}s</span>
              </div>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-mono">SPEED:</span>
              {[1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                    playbackSpeed === spd
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}

              <div className="h-4 w-px bg-neutral-800 mx-1"></div>

              {/* Handover Button: jump straight into the live interactive module */}
              <button
                onClick={() => {
                  if (chapter.visualMode === 'physics') onNavigateToModule('physics');
                  else if (chapter.visualMode === 'novel') onNavigateToModule('studio');
                  else if (chapter.visualMode === 'metacognitive') onNavigateToModule('tracker');
                  else onNavigateToModule('diligence');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-medium border border-neutral-700 transition"
              >
                <span>Take the Wheel</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
