import React, { useState } from 'react';
import { Cpu, Film, CheckCircle2, Clock, Zap, Download, RefreshCw, HardDrive } from 'lucide-react';
import { RenderJob } from '../types/creativeOs';

export default function MediaEnginePanel() {
  const [jobs, setJobs] = useState<RenderJob[]>([
    {
      id: 'job_8829',
      projectId: 'proj_worthwyl_alpha',
      format: 'mp4_4k',
      status: 'completed',
      progress: 100,
      durationSec: 40,
      latencyMs: 3820,
    },
    {
      id: 'job_8830',
      projectId: 'proj_worthwyl_alpha',
      format: 'wav_master',
      status: 'completed',
      progress: 100,
      durationSec: 40,
      latencyMs: 940,
    },
  ]);

  const [isQueueing, setIsQueueing] = useState(false);

  const handleTriggerRender = (format: 'mp4_4k' | 'mp4_vertical' | 'podcast_pkg') => {
    setIsQueueing(true);
    const newId = `job_${Math.floor(1000 + Math.random() * 9000)}`;

    const newJob: RenderJob = {
      id: newId,
      projectId: 'proj_worthwyl_alpha',
      format,
      status: 'queued',
      progress: 5,
      durationSec: 40,
      latencyMs: 0,
    };

    setJobs(prev => [newJob, ...prev]);

    // Simulate pipeline phases: Queued -> Synthesizing Audio -> GPU MP4 Assembly -> Completed
    setTimeout(() => {
      setJobs(prev =>
        prev.map(j => (j.id === newId ? { ...j, status: 'synthesizing', progress: 45 } : j))
      );
    }, 900);

    setTimeout(() => {
      setJobs(prev =>
        prev.map(j => (j.id === newId ? { ...j, status: 'processing', progress: 85 } : j))
      );
    }, 2200);

    setTimeout(() => {
      setJobs(prev =>
        prev.map(j =>
          j.id === newId
            ? { ...j, status: 'completed', progress: 100, latencyMs: Math.floor(3200 + Math.random() * 900) }
            : j
        )
      );
      setIsQueueing(false);
    }, 3800);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-800">
              Media Engine & GPU Pipeline
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Phase 2 GPU-accelerated assembly, chunked speech synthesis & resumable render workers
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleTriggerRender('mp4_4k')}
            disabled={isQueueing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Film className="w-3.5 h-3.5" />
            Assemble 4K Master MP4
          </button>
          <button
            onClick={() => handleTriggerRender('mp4_vertical')}
            disabled={isQueueing}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Render 9:16 Vertical Video
          </button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Render Target</div>
          <div className="text-base font-bold text-neutral-900 mt-1 font-mono">&lt; 5.0s / 60s Clip</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Exceeds Benchmark
          </div>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Audio Synthesis</div>
          <div className="text-base font-bold text-neutral-900 mt-1 font-mono">Parallel Chunks</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Streaming buffer & 48kHz float</div>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Multi-Stage Cache</div>
          <div className="text-base font-bold text-neutral-900 mt-1 font-mono">3-Tier Active</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Timeline → Audio → MP4 Layers</div>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">Cluster Nodes</div>
          <div className="text-base font-bold text-neutral-900 mt-1 font-mono">AKS High-IO + GPU</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">KEDA event-driven autoscaling</div>
        </div>
      </div>

      {/* Render Queue Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          Active Render Queue & Checkpoints
        </h3>

        <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
          {jobs.map(job => (
            <div key={job.id} className="p-3.5 bg-white flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    job.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-indigo-50 text-indigo-600 animate-pulse'
                  }`}
                >
                  {job.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-800 font-mono flex items-center gap-2">
                    {job.id}
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-sans font-semibold bg-neutral-100 text-neutral-600">
                      {job.format.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Duration: {job.durationSec}s | Status:{' '}
                    <span className="font-semibold text-neutral-700">{job.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {job.latencyMs > 0 && (
                  <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {(job.latencyMs / 1000).toFixed(2)}s render
                  </span>
                )}

                <div className="w-28 bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                {job.status === 'completed' && (
                  <button
                    onClick={() => alert(`Downloaded artifact package for ${job.id} (${job.format})`)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition"
                  >
                    <Download className="w-3 h-3" />
                    Asset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
