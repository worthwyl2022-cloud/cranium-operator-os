import React, { useState } from 'react';
import { Archive, Lock, Key, ShieldCheck, Clock, FileText, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { MiracleArchiveEntry, Metrics } from '../types/creativeOs';

interface Props {
  currentMetrics: Metrics;
}

export default function MiracleArchivePanel({ currentMetrics }: Props) {
  const [entries, setEntries] = useState<MiracleArchiveEntry[]>([
    {
      id: 'miracle_canon_001',
      title: 'The Great Orbital Severance — Original Canon',
      timestamp: Date.now() - 86400000 * 4,
      encrypted: true,
      aesKeyFingerprint: 'SHA256:4f8e9b01a2d763...[Azure KeyVault]',
      tags: ['space', 'isolation', 'meaning'],
      cognitiveSnapshot: {
        emotional_baseline: -0.28,
        tension: 0.42,
        coherence: 0.94,
        continuity: 0.81,
        theme_drift: 0.12,
      },
      timeCapsuleLockedUntil: Date.now() + 86400000 * 365 * 5, // 5 years in future
      heirloomDesignee: 'Creative Successor / Family Trust #882',
      manifestHash: '0x99a14bcde0813476fdeea901041444bcfa89',
      summary: 'Complete master recording and emotional telemetry of the foundational space chapter.',
    },
    {
      id: 'miracle_canon_002',
      title: 'Philosophical Axioms on AI Creative Autonomy',
      timestamp: Date.now() - 86400000 * 12,
      encrypted: true,
      aesKeyFingerprint: 'SHA256:77e4bc8199214a...[Azure KeyVault]',
      tags: ['meaning', 'technology'],
      cognitiveSnapshot: {
        emotional_baseline: 0.35,
        tension: 0.15,
        coherence: 0.98,
        continuity: 0.89,
        theme_drift: 0.05,
      },
      manifestHash: '0x32cf09ea771801bfb982181467ccdde140',
      summary: 'Curated creative manifesto defining human intentionality inside autonomous generation systems.',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [isTimeCapsule, setIsTimeCapsule] = useState(false);
  const [lockYears, setLockYears] = useState(10);
  const [designee, setDesignee] = useState('Creative Heir / Archival Repository');

  const handleCreateArchival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEntry: MiracleArchiveEntry = {
      id: `miracle_canon_00${entries.length + 1}`,
      title: newTitle,
      timestamp: Date.now(),
      encrypted: true,
      aesKeyFingerprint: `SHA256:${Math.random().toString(36).substring(2, 12)}...[Azure KeyVault]`,
      tags: ['meaning', 'continuity'],
      cognitiveSnapshot: { ...currentMetrics },
      timeCapsuleLockedUntil: isTimeCapsule ? Date.now() + 86400000 * 365 * lockYears : undefined,
      heirloomDesignee: designee,
      manifestHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      summary: newSummary || 'Cryptographically sealed generational creative atom.',
    };

    setEntries([newEntry, ...entries]);
    setNewTitle('');
    setNewSummary('');
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-800">
              Miracle Archive — Generational Layer
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            The world's first creative subsystem built to outlive its creator with AES-256 time-capsules & heirloom policies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            Double Envelope AES-256
          </span>
        </div>
      </div>

      {/* Sealed Entry Creator Form */}
      <form onSubmit={handleCreateArchival} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Seal New Generational Artifact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Archive Title / Creative Testament..."
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />

          <input
            type="text"
            value={designee}
            onChange={e => setDesignee(e.target.value)}
            placeholder="Heirloom Beneficiary / Lineage..."
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <textarea
          rows={2}
          value={newSummary}
          onChange={e => setNewSummary(e.target.value)}
          placeholder="Archival context summary (will be paired with exact cognitive resonance snapshot)..."
          className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
            <input
              type="checkbox"
              checked={isTimeCapsule}
              onChange={e => setIsTimeCapsule(e.target.checked)}
              className="accent-amber-600 rounded"
            />
            <span>Enable Time-Capsule Vault Lock</span>
          </label>

          {isTimeCapsule && (
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span>Lock Duration:</span>
              <select
                value={lockYears}
                onChange={e => setLockYears(parseInt(e.target.value))}
                className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-semibold"
              >
                <option value={1}>1 Year</option>
                <option value={5}>5 Years</option>
                <option value={10}>10 Years (Generational)</option>
                <option value={25}>25 Years (Quarter Century)</option>
                <option value={50}>50 Years (Legacy Vault)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            Seal & Mint Legacy Manifest
          </button>
        </div>
      </form>

      {/* Archives List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          Sealed Miracle Vault Entries ({entries.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{entry.title}</h4>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Sealed: {new Date(entry.timestamp).toLocaleDateString()} | {entry.id}
                  </div>
                </div>
                {entry.timeCapsuleLockedUntil ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-amber-600" />
                    LOCKED UNTIL {new Date(entry.timeCapsuleLockedUntil).getFullYear()}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    HEIRLOOM ACTIVE
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">{entry.summary}</p>

              {/* Cognitive Snapshot */}
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-600">
                <span>Valence: {entry.cognitiveSnapshot.emotional_baseline.toFixed(2)}</span>
                <span>Tension: {entry.cognitiveSnapshot.tension.toFixed(2)}</span>
                <span>Coherence: {entry.cognitiveSnapshot.coherence.toFixed(2)}</span>
                <span>Drift: {entry.cognitiveSnapshot.theme_drift.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="truncate max-w-[200px]" title={entry.heirloomDesignee}>
                  Beneficiary: {entry.heirloomDesignee}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">
                  {entry.manifestHash.slice(0, 10)}…
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
