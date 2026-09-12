import { useState, FormEvent } from 'react';
import { 
  Cpu, Plus, Trash2, Zap, Shield, Activity, RefreshCw, 
  Info, AlertTriangle, CheckCircle, Flame, Compass 
} from 'lucide-react';
import { CognitiveAtom, Directive, Metrics } from '../../types/creativeOs';
import { ResonanceField } from '../core/field';
import { resolve, CALIBRATED_THRESHOLDS } from '../core/loop';

interface Props {
  field: ResonanceField;
  metrics: Metrics;
  onAtomInjected: (atom: CognitiveAtom) => void;
  onAtomRemoved: (id: string) => void;
  onResetField: () => void;
}

export default function ResonanceFieldView({ 
  field, 
  metrics, 
  onAtomInjected, 
  onAtomRemoved, 
  onResetField 
}: Props) {
  const [charge, setCharge] = useState<number>(0.5);
  const [mass, setMass] = useState<number>(5.0);
  const [velocity, setVelocity] = useState<number>(0.6);
  const [kind, setKind] = useState<'episodic' | 'theme' | 'character' | 'world'>('episodic');
  const [label, setLabel] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('conflict, revelation');

  const atoms = field.getAtoms();
  const directives = resolve(metrics);

  const handleInject = (e: FormEvent) => {
    e.preventDefault();
    const tagList = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newAtom: CognitiveAtom = {
      id: `atom-${Date.now()}`,
      charge,
      mass,
      velocity,
      kind,
      tags: tagList.length > 0 ? tagList : ['narrative'],
      label: label.trim() || `Atom #${atoms.length + 1}`
    };

    onAtomInjected(newAtom);
    setLabel('');
  };

  const handleLoadPreset = (scenario: 'conflict' | 'flatline' | 'drift' | 'balanced') => {
    onResetField();
    if (scenario === 'conflict') {
      // Injects strong opposite polarity atoms to trigger STABILIZE
      onAtomInjected({
        id: 'atom-high-pos',
        charge: 0.95,
        mass: 9.0,
        velocity: 0.8,
        kind: 'episodic',
        tags: ['sovereignty', 'triumph'],
        label: 'Triumphant Breakthrough'
      });
      onAtomInjected({
        id: 'atom-high-neg',
        charge: -0.95,
        mass: 9.0,
        velocity: 0.8,
        kind: 'episodic',
        tags: ['devastation', 'betrayal'],
        label: 'Catastrophic Betrayal'
      });
    } else if (scenario === 'flatline') {
      // Near zero charge and mass to trigger ESCALATE
      onAtomInjected({
        id: 'atom-neutral-1',
        charge: 0.02,
        mass: 1.0,
        velocity: 0.2,
        kind: 'episodic',
        tags: ['routine', 'waiting'],
        label: 'Idle Dialogue Beat'
      });
      onAtomInjected({
        id: 'atom-neutral-2',
        charge: -0.01,
        mass: 1.0,
        velocity: 0.2,
        kind: 'episodic',
        tags: ['routine', 'waiting'],
        label: 'Corridor Transit'
      });
    } else if (scenario === 'drift') {
      // Establish theme base first, then inject unweighted random tags
      onAtomInjected({
        id: 'atom-theme-1',
        charge: 0.5,
        mass: 8.0,
        velocity: 0.5,
        kind: 'theme',
        tags: ['cybernetics', 'identity', 'secrecy'],
        label: 'Core Theme Canon'
      });
      for (let i = 0; i < 4; i++) {
        onAtomInjected({
          id: `atom-drift-${i}`,
          charge: 0.4,
          mass: 5.0,
          velocity: 0.7,
          kind: 'episodic',
          tags: ['gardening', 'cooking', 'baking'],
          label: `Unanchored Beat ${i + 1}`
        });
      }
    } else {
      // Balanced narrative
      onAtomInjected({
        id: 'atom-theme-base',
        charge: 0.6,
        mass: 8.0,
        velocity: 0.5,
        kind: 'theme',
        tags: ['isolation', 'discovery', 'meaning'],
        label: 'Thematic Axiom'
      });
      onAtomInjected({
        id: 'atom-ep-1',
        charge: -0.4,
        mass: 6.0,
        velocity: 0.6,
        kind: 'episodic',
        tags: ['discovery', 'obstacle'],
        label: 'Obstacle Encounter'
      });
      onAtomInjected({
        id: 'atom-ep-2',
        charge: 0.7,
        mass: 7.0,
        velocity: 0.5,
        kind: 'episodic',
        tags: ['meaning', 'resilience'],
        label: 'Strategic Breakthrough'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Cognitive Physics Substrate
            </span>
            <span className="text-xs text-neutral-400 font-mono">NON-LINEAR DYNAMICS & GOVERNANCE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Resonance Field Laboratory</h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
            Inject and visualize Cognitive Atoms. Observe non-linear tension calculations, collision penalties, and autonomous directive governance.
          </p>
        </div>

        {/* Presets Button Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 px-2">VISUALIZE:</span>
          <button
            onClick={() => handleLoadPreset('balanced')}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-300 transition"
          >
            Harmonic Balance
          </button>
          <button
            onClick={() => handleLoadPreset('conflict')}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-red-300 transition"
          >
            Polar Collision
          </button>
          <button
            onClick={() => handleLoadPreset('flatline')}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition"
          >
            Momentum Flatline
          </button>
          <button
            onClick={() => handleLoadPreset('drift')}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-purple-300 transition"
          >
            Theme Drift
          </button>
        </div>
      </div>

      {/* Primary Telemetry & Directive Output */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">COHERENCE</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {(metrics.coherence * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-neutral-500">Floor: {CALIBRATED_THRESHOLDS.coherence_floor * 100}%</div>
          <div className="h-1.5 w-full bg-neutral-950 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${metrics.coherence < CALIBRATED_THRESHOLDS.coherence_floor ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${metrics.coherence * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">TENSION</div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {metrics.tension.toFixed(3)}
          </div>
          <div className="text-[11px] text-neutral-500">Floor: {CALIBRATED_THRESHOLDS.tension_floor}</div>
          <div className="h-1.5 w-full bg-neutral-950 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${metrics.tension < CALIBRATED_THRESHOLDS.tension_floor ? 'bg-red-500' : 'bg-amber-500'}`} 
              style={{ width: `${Math.min(100, metrics.tension * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">CONTINUITY</div>
          <div className="text-2xl font-bold font-mono text-indigo-400">
            {(metrics.continuity * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-neutral-500">Floor: {CALIBRATED_THRESHOLDS.continuity_floor * 100}%</div>
          <div className="h-1.5 w-full bg-neutral-950 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${metrics.continuity < CALIBRATED_THRESHOLDS.continuity_floor ? 'bg-red-500' : 'bg-indigo-500'}`} 
              style={{ width: `${metrics.continuity * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">THEME DRIFT</div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {(metrics.theme_drift * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-neutral-500">Ceiling: {CALIBRATED_THRESHOLDS.theme_drift_ceiling * 100}%</div>
          <div className="h-1.5 w-full bg-neutral-950 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${metrics.theme_drift > CALIBRATED_THRESHOLDS.theme_drift_ceiling ? 'bg-red-500' : 'bg-purple-500'}`} 
              style={{ width: `${metrics.theme_drift * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">DIRECTIVE GOVERNOR</div>
          <div className="text-sm font-bold font-mono text-amber-300 mt-1 uppercase">
            {directives.join(' & ')}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            {directives.includes(Directive.STABILIZE) && "Ground scene & resolve polarity collisions."}
            {directives.includes(Directive.ESCALATE) && "Inject stakes; tension below floor."}
            {directives.includes(Directive.SHIFT_THEME) && "Thematic drift detected; anchor canon."}
            {directives.includes(Directive.ADVANCE) && "Harmonic balance; advance arc."}
          </div>
        </div>
      </div>

      {/* Atom Injector Form & Active Field Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Atom Injector */}
        <div className="lg:col-span-5 bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Inject Cognitive Atom</h3>
            </div>
            <span className="text-xs font-mono text-neutral-400">MANUAL SYNTHESIS</span>
          </div>

          <form onSubmit={handleInject} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Atom Label / Narrative Event</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="E.g., Breach of the Perimeter Gate"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Charge (Valence: {charge > 0 ? `+${charge}` : charge})
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={charge}
                  onChange={(e) => setCharge(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>-1.0 (Dark/Conflict)</span>
                  <span>+1.0 (Hope)</span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Mass (Weight: {mass.toFixed(1)})
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={mass}
                  onChange={(e) => setMass(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>0.5 (Minor)</span>
                  <span>10.0 (Axiom)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Velocity ({velocity.toFixed(2)})</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={velocity}
                  onChange={(e) => setVelocity(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Kind</label>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
                >
                  <option value="episodic">Episodic (Scene/Action)</option>
                  <option value="theme">Theme (Core Canon)</option>
                  <option value="character">Character Arc</option>
                  <option value="world">World Fact</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="revelation, betrayal, technology..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Inject Into Resonance Field</span>
            </button>
          </form>
        </div>

        {/* Right: Active Field Atoms Constellation */}
        <div className="lg:col-span-7 bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Active Resonance Atoms ({atoms.length})</h3>
            </div>
            <button
              onClick={onResetField}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-mono transition"
            >
              <RefreshCw className="w-3 h-3" /> Clear Field
            </button>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {atoms.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 italic">
                Resonance Field is empty. Inject an atom or choose a visualization preset above.
              </div>
            ) : (
              atoms.map((atom) => (
                <div
                  key={atom.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{atom.label || atom.id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-800 text-neutral-400 uppercase">
                        {atom.kind}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {Array.from(atom.tags).map((t, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-neutral-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono text-[11px]">
                      <div className={atom.charge >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        Q: {atom.charge >= 0 ? `+${atom.charge.toFixed(2)}` : atom.charge.toFixed(2)}
                      </div>
                      <div className="text-neutral-500 text-[10px]">
                        M: {atom.mass.toFixed(1)} | V: {atom.velocity.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => onAtomRemoved(atom.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition"
                      title="Remove from field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
