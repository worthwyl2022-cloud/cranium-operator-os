import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Wand2, Sliders, Music, Mic, Layers, Plus } from 'lucide-react';
import { TimelineTrack, ScriptBeat, Directive } from '../types/creativeOs';

interface Props {
  onInjectBeat: (title: string, text: string, charge: number, mass: number) => void;
  activeDirectiveOutput: string;
  activeDirectives: Directive[];
}

export default function StudioWorkspace({ onInjectBeat, activeDirectiveOutput, activeDirectives }: Props) {
  // Script beat creation state
  const [beatTitle, setBeatTitle] = useState('Prologue: The Fracture');
  const [beatText, setBeatText] = useState(
    'In the silent orbit beyond the moon, the resonance relay suddenly severed its link to Earth. Captain Elena watched the telemetry flatline.'
  );
  const [charge, setCharge] = useState(-0.4);
  const [mass, setMass] = useState(6.5);
  const [activePreset, setActivePreset] = useState<'cinematic' | 'tiktok' | 'podcast' | 'audiobook'>('cinematic');

  // Timeline tracks state
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'trk_voice',
      name: 'Elena Voiceover (AI Chunked)',
      type: 'voice',
      volume: 0.9,
      muted: false,
      clips: [
        { id: 'c1', title: 'Beat 1: The Severance', startSec: 0, durationSec: 14, color: 'bg-blue-600', gain: 1.0 },
        { id: 'c2', title: 'Beat 2: Protocol Alert', startSec: 16, durationSec: 18, color: 'bg-blue-700', gain: 0.95 },
      ],
    },
    {
      id: 'trk_score',
      name: 'Dynamic Harmonic Score',
      type: 'music',
      volume: 0.65,
      muted: false,
      clips: [
        { id: 'c3', title: 'Low Strings Drone', startSec: 0, durationSec: 36, color: 'bg-indigo-600', gain: 0.7 },
      ],
    },
    {
      id: 'trk_ambience',
      name: 'Void Ambience & Sub-Bass',
      type: 'ambience',
      volume: 0.5,
      muted: false,
      clips: [
        { id: 'c4', title: 'Cosmic Wind Room Tone', startSec: 0, durationSec: 40, color: 'bg-neutral-600', gain: 0.5 },
      ],
    },
    {
      id: 'trk_sfx',
      name: 'Diegetic Telemetry SFX',
      type: 'sfx',
      volume: 0.8,
      muted: false,
      clips: [
        { id: 'c5', title: 'Telemetry Alarm', startSec: 15, durationSec: 4, color: 'bg-red-600', gain: 0.9 },
      ],
    },
  ]);

  // Playback simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSec, setPlaybackSec] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSec(s => (s >= 40 ? 0 : Number((s + 0.5).toFixed(1))));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleApplyPreset = (preset: 'cinematic' | 'tiktok' | 'podcast' | 'audiobook') => {
    setActivePreset(preset);
    if (preset === 'tiktok') {
      setCharge(-0.8);
      setMass(12.0);
      setBeatTitle('Viral Hook: The 3-Second Crisis');
      setBeatText('Stop scrolling. In 2026, humanity just detected an impossible radio beacon pulse.');
    } else if (preset === 'cinematic') {
      setCharge(-0.3);
      setMass(7.0);
      setBeatTitle('Act II: The Cognitive Dilemma');
      setBeatText('The data did not lie, but accepting it meant invalidating forty years of established space canon.');
    } else if (preset === 'podcast') {
      setCharge(0.2);
      setMass(4.0);
      setBeatTitle('Episodic Analysis: Chapter 4');
      setBeatText('Welcome back to WorthWyl Chronicles. Today we unravel what happened to the first orbital colony.');
    } else if (preset === 'audiobook') {
      setCharge(0.5);
      setMass(9.0);
      setBeatTitle('Generational Passage: Volume 1');
      setBeatText('To whoever inherits this record: these were the thoughts of a creator at the frontier of thought.');
    }
  };

  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beatText.trim()) return;
    onInjectBeat(beatTitle, beatText, charge, mass);
  };

  const toggleMute = (trackId: string) => {
    setTracks(cur => cur.map(t => (t.id === trackId ? { ...t, muted: !t.muted } : t)));
  };

  const setVolume = (trackId: string, val: number) => {
    setTracks(cur => cur.map(t => (t.id === trackId ? { ...t, volume: val } : t)));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Presets & Quick Mode */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Studio Production Presets:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'cinematic', label: 'Cinematic Arc' },
              { id: 'tiktok', label: 'Vertical / TikTok' },
              { id: 'podcast', label: 'Episodic Podcast' },
              { id: 'audiobook', label: 'Generational Legacy' },
            ] as const
          ).map(p => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activePreset === p.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Script Beat & Cognitive Injector */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-600" />
              Creative Script & Beat Engine
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">Cranium Directed</span>
          </div>

          <form onSubmit={handleInject} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Beat Headline / Scene</label>
              <input
                type="text"
                value={beatTitle}
                onChange={e => setBeatTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                placeholder="E.g., Act II: The Discovery..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Story / Passage Text</label>
              <textarea
                rows={4}
                value={beatText}
                onChange={e => setBeatText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30 resize-none font-serif leading-relaxed"
                placeholder="Write the creative beat text here..."
              />
            </div>

            {/* Valence Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
                <span>Emotional Valence (Charge):</span>
                <span className={`font-mono font-bold ${charge >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {charge > 0 ? '+' : ''}
                  {charge.toFixed(2)} ({charge < -0.2 ? 'Tension' : charge > 0.2 ? 'Wonder' : 'Neutral'})
                </span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={charge}
                onChange={e => setCharge(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>-1.0 (Crisis / Conflict)</span>
                <span>0.0</span>
                <span>+1.0 (Euphoria / Resolution)</span>
              </div>
            </div>

            {/* Mass / Stakes Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1">
                <span>Narrative Mass (Importance 0–20):</span>
                <span className="font-mono font-bold text-neutral-800">{mass.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20.0"
                step="0.5"
                value={mass}
                onChange={e => setMass(parseFloat(e.target.value))}
                className="w-full accent-neutral-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>0.5 (Passing detail)</span>
                <span>10.0 (Core beat)</span>
                <span>20.0 (Climax pivot)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              Pulse into Resonance Field
            </button>
          </form>

          {/* AI Cognitive Steering Output Card */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Cranium Cognitive Steering
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                Live Feedback
              </span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed italic bg-white p-2.5 rounded border border-neutral-100 font-sans">
              "{activeDirectiveOutput}"
            </p>
          </div>
        </div>

        {/* Right column: Multi-Track Timeline & Audio Mixer */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                Multi-Track Media Timeline
              </h3>
            </div>

            {/* Playhead & Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition shadow-sm"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause' : 'Play Timeline'}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setPlaybackSec(0);
                }}
                className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition"
                title="Reset playhead"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-bold text-neutral-700 px-2 py-1 bg-neutral-100 rounded border border-neutral-200">
                00:{playbackSec < 10 ? `0${Math.floor(playbackSec)}` : Math.floor(playbackSec)}s / 00:40s
              </span>
            </div>
          </div>

          {/* Timeline Tracks Display */}
          <div className="space-y-3 relative">
            {/* Playhead Scrubber Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none transition-all duration-300"
              style={{ left: `calc(190px + ${(playbackSec / 40) * 62}%)` }}
            >
              <div className="w-2.5 h-2.5 -ml-1 -top-1 bg-red-500 rounded-full" />
            </div>

            {tracks.map(track => (
              <div
                key={track.id}
                className={`p-2.5 rounded-lg border transition ${
                  track.muted ? 'bg-neutral-50/50 border-neutral-200 opacity-60' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 w-44">
                    {track.type === 'voice' && <Mic className="w-3.5 h-3.5 text-blue-600" />}
                    {track.type === 'music' && <Music className="w-3.5 h-3.5 text-indigo-600" />}
                    {track.type === 'ambience' && <Layers className="w-3.5 h-3.5 text-neutral-600" />}
                    {track.type === 'sfx' && <Sparkles className="w-3.5 h-3.5 text-red-600" />}
                    <span className="text-xs font-bold text-neutral-800 truncate" title={track.name}>
                      {track.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMute(track.id)}
                      className="text-neutral-500 hover:text-neutral-900 transition"
                      title={track.muted ? 'Unmute' : 'Mute'}
                    >
                      {track.muted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={track.volume}
                      disabled={track.muted}
                      onChange={e => setVolume(track.id, parseFloat(e.target.value))}
                      className="w-16 accent-blue-600 h-1 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-neutral-500 w-8">
                      {Math.round(track.volume * 100)}%
                    </span>
                  </div>
                </div>

                {/* Waveform Clips lane */}
                <div className="h-8 bg-neutral-200/70 rounded-md relative overflow-hidden flex items-center px-1">
                  {track.clips.map(clip => {
                    const leftPct = (clip.startSec / 40) * 100;
                    const widthPct = (clip.durationSec / 40) * 100;

                    return (
                      <div
                        key={clip.id}
                        className={`absolute h-6 rounded px-2 flex items-center justify-between text-[11px] font-semibold text-white shadow-sm truncate ${clip.color}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      >
                        <span className="truncate">{clip.title}</span>
                        {/* Fake animated waveform lines */}
                        <div className="flex items-center gap-0.5 ml-1 opacity-60">
                          <span className="w-0.5 h-3 bg-white rounded-full" />
                          <span className="w-0.5 h-4 bg-white rounded-full" />
                          <span className="w-0.5 h-2 bg-white rounded-full" />
                          <span className="w-0.5 h-5 bg-white rounded-full" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
            <span>Auto-Mixing Engine: Active (Gain leveling & normalization enabled)</span>
            <span className="font-mono text-emerald-600 font-semibold">Ready to Render</span>
          </div>
        </div>
      </div>
    </div>
  );
}
