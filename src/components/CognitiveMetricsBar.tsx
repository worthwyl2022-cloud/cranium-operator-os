import React from 'react';
import { Directive, Metrics } from '../types/creativeOs';
import { Activity, AlertTriangle, Flame, ShieldAlert, Sparkles, Compass } from 'lucide-react';

interface Props {
  metrics: Metrics;
  directives: Directive[];
  cycle: number;
}

export default function CognitiveMetricsBar({ metrics, directives, cycle }: Props) {
  // Calibrated threshold comparisons
  const coherenceLow = metrics.coherence < 0.90;
  const continuityLow = metrics.continuity < 0.45;
  const tensionLow = metrics.tension < 0.08;
  const themeDriftHigh = metrics.theme_drift > 0.35;

  const directiveBadges: Record<Directive, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
    [Directive.STABILIZE]: {
      label: 'STABILIZE',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />,
      desc: 'Coherence or continuity degraded. Dampen volatility and anchor canonical facts.',
    },
    [Directive.ESCALATE]: {
      label: 'ESCALATE',
      color: 'bg-red-100 text-red-900 border-red-300',
      icon: <Flame className="w-3.5 h-3.5 text-red-700" />,
      desc: 'Field is inert (tension < 0.08). Inject decisive creative conflict or heightened stakes.',
    },
    [Directive.SHIFT_THEME]: {
      label: 'SHIFT THEME',
      color: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: <Compass className="w-3.5 h-3.5 text-purple-700" />,
      desc: 'Theme drift exceeds 0.35 ceiling. Promotes recent episodic memory into canonical themes.',
    },
    [Directive.ADVANCE]: {
      label: 'ADVANCE',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-700" />,
      desc: 'Substrate is resonant and aligned. Proceed with narrative synthesis and pacing.',
    },
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
            Cognitive Telemetry & Directives
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-600 border border-neutral-200">
            Cycle #{cycle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Active Directive:</span>
          <div className="flex gap-1.5 flex-wrap">
            {directives.map(d => {
              const badge = directiveBadges[d];
              return (
                <span
                  key={d}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${badge.color}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Baseline Valence */}
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Emotional Valence</div>
          <div className="text-lg font-mono font-bold mt-1 text-neutral-900">
            {metrics.emotional_baseline > 0 ? '+' : ''}
            {metrics.emotional_baseline.toFixed(3)}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${metrics.emotional_baseline >= 0 ? 'bg-blue-600' : 'bg-red-600'}`}
              style={{ width: `${Math.min(100, Math.abs(metrics.emotional_baseline) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Dampened 0.7 mass-weight</div>
        </div>

        {/* Tension */}
        <div className={`p-3 rounded-lg border ${tensionLow ? 'bg-red-50 border-red-200' : 'bg-neutral-50 border-neutral-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Tension</span>
            {tensionLow && <AlertTriangle className="w-3 h-3 text-red-500" />}
          </div>
          <div className="text-lg font-mono font-bold mt-1 text-neutral-900">
            {metrics.tension.toFixed(3)}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${tensionLow ? 'bg-red-500' : 'bg-neutral-800'}`}
              style={{ width: `${Math.min(100, metrics.tension * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Floor: 0.080</div>
        </div>

        {/* Coherence */}
        <div className={`p-3 rounded-lg border ${coherenceLow ? 'bg-amber-50 border-amber-200' : 'bg-neutral-50 border-neutral-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Coherence</span>
            {coherenceLow && <AlertTriangle className="w-3 h-3 text-amber-500" />}
          </div>
          <div className="text-lg font-mono font-bold mt-1 text-neutral-900">
            {metrics.coherence.toFixed(3)}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${coherenceLow ? 'bg-amber-500' : 'bg-blue-600'}`}
              style={{ width: `${Math.min(100, metrics.coherence * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Floor: 0.900</div>
        </div>

        {/* Continuity */}
        <div className={`p-3 rounded-lg border ${continuityLow ? 'bg-amber-50 border-amber-200' : 'bg-neutral-50 border-neutral-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Continuity</span>
            {continuityLow && <AlertTriangle className="w-3 h-3 text-amber-500" />}
          </div>
          <div className="text-lg font-mono font-bold mt-1 text-neutral-900">
            {metrics.continuity.toFixed(3)}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${continuityLow ? 'bg-amber-500' : 'bg-blue-600'}`}
              style={{ width: `${Math.min(100, metrics.continuity * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Floor: 0.450</div>
        </div>

        {/* Theme Drift */}
        <div className={`p-3 rounded-lg border ${themeDriftHigh ? 'bg-purple-50 border-purple-200' : 'bg-neutral-50 border-neutral-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Theme Drift</span>
            {themeDriftHigh && <AlertTriangle className="w-3 h-3 text-purple-500" />}
          </div>
          <div className="text-lg font-mono font-bold mt-1 text-neutral-900">
            {metrics.theme_drift.toFixed(3)}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${themeDriftHigh ? 'bg-purple-600' : 'bg-neutral-700'}`}
              style={{ width: `${Math.min(100, metrics.theme_drift * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Ceiling: 0.350</div>
        </div>
      </div>
    </div>
  );
}
