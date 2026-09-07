import { useState, useMemo } from 'react';
import { 
  Play, Brain, BookOpen, Cpu, FileText, Sparkles, 
  ShieldCheck, RefreshCw, Zap, Compass, Download, 
  ExternalLink, Server
} from 'lucide-react';
import { CognitiveAtom, Directive, Metrics } from './types/creativeOs';
import { ResonanceField } from './worthwyl/core/field';
import AcquisitionVideoDemo from './worthwyl/demo/AcquisitionVideoDemo';
import MetacognitiveView from './worthwyl/metacognition/MetacognitiveView';
import CreatorStudioView from './worthwyl/studio/CreatorStudioView';
import ResonanceFieldView from './worthwyl/physics/ResonanceFieldView';
import DiligenceDataRoom from './worthwyl/diligence/DiligenceDataRoom';

type ActiveView = 'demo' | 'metacognition' | 'studio' | 'physics' | 'diligence';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('demo');

  // Shared Resonance Field Substrate
  const field = useMemo(() => {
    const rf = new ResonanceField();
    // Seed core thematic & narrative atoms
    rf.inject({
      id: 'atom-canon-1',
      charge: 0.5,
      mass: 8.5,
      velocity: 0.35,
      kind: 'theme',
      tags: ['sovereignty', 'human_intentionality'],
      label: 'Foundational Sovereign Intent'
    });
    rf.inject({
      id: 'atom-canon-2',
      charge: -0.3,
      mass: 7.0,
      velocity: 0.5,
      kind: 'episodic',
      tags: ['isolation', 'discovery'],
      label: 'Deep Relay Silence'
    });
    rf.inject({
      id: 'atom-canon-3',
      charge: 0.65,
      mass: 6.5,
      velocity: 0.6,
      kind: 'episodic',
      tags: ['discovery', 'resonance'],
      label: 'Harmonic Awakening'
    });
    return rf;
  }, []);

  const [metrics, setMetrics] = useState<Metrics>(() => field.metrics());
  const [activeDirective, setActiveDirective] = useState<Directive>(Directive.ADVANCE);

  const handleAtomInjected = (atom: CognitiveAtom) => {
    field.inject(atom);
    const updated = field.metrics();
    setMetrics(updated);
  };

  const handleAtomRemoved = (id: string) => {
    field.remove(id);
    const updated = field.metrics();
    setMetrics(updated);
  };

  const handleResetField = () => {
    field.clear();
    field.inject({
      id: 'atom-init',
      charge: 0.4,
      mass: 6.0,
      velocity: 0.4,
      kind: 'theme',
      tags: ['creation', 'grounding'],
      label: 'Grounding Canon Axiom'
    });
    setMetrics(field.metrics());
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Operating System Top Bar */}
      <header className="bg-neutral-900/95 backdrop-blur border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Substrate Pulse */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-sm text-amber-400">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  WORTHWYL CREATIVE OS
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  CRANIUM CORE v3
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SUBSTRATE ACTIVE // NON-LINEAR RESONANCE</span>
              </div>
            </div>
          </div>

          {/* Core System Navigation */}
          <nav className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveView('demo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'demo'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Acquisition Demo</span>
            </button>

            <button
              onClick={() => setActiveView('metacognition')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'metacognition'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Metacognitive Tracker</span>
            </button>

            <button
              onClick={() => setActiveView('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'studio'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => setActiveView('physics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'physics'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Resonance Lab</span>
            </button>

            <button
              onClick={() => setActiveView('diligence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'diligence'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Diligence Room</span>
            </button>
          </nav>

          {/* Right Status Pill */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
            <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-2">
              <span className="text-neutral-400">COH:</span>
              <span className="text-emerald-400 font-bold">{(metrics.coherence * 100).toFixed(0)}%</span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400">TEN:</span>
              <span className="text-amber-400 font-bold">{metrics.tension.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main OS View Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {activeView === 'demo' && (
          <AcquisitionVideoDemo 
            onNavigateToModule={(mod) => setActiveView(mod === 'tracker' ? 'metacognition' : mod as ActiveView)} 
          />
        )}

        {activeView === 'metacognition' && (
          <MetacognitiveView onExportSummary={() => setActiveView('diligence')} />
        )}

        {activeView === 'studio' && (
          <CreatorStudioView
            field={field}
            metrics={metrics}
            onAtomInjected={handleAtomInjected}
            onNavigateToDemo={() => setActiveView('demo')}
          />
        )}

        {activeView === 'physics' && (
          <ResonanceFieldView
            field={field}
            metrics={metrics}
            onAtomInjected={handleAtomInjected}
            onAtomRemoved={handleAtomRemoved}
            onResetField={handleResetField}
          />
        )}

        {activeView === 'diligence' && (
          <DiligenceDataRoom />
        )}
      </main>

      {/* OS Status Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 text-xs text-neutral-400 py-3.5 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-neutral-200">WorthWyl Cognitive Substrate</span>
            <span>&bull; Microsoft Azure Ready &bull; Tier 3 Substrate Roadmap</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => setActiveView('diligence')}
              className="hover:text-amber-400 transition underline font-mono text-[11px]"
            >
              Export Complete Package (.md)
            </button>
            <span className="text-neutral-500 font-mono text-[11px]">
              CANON LOCKED &bull; 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
