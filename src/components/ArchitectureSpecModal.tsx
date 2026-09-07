import React, { useState } from 'react';
import { X, Server, Layers, Shield, Cpu, Network, CheckCircle, ExternalLink, Code } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureSpecModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'contracts' | 'k8s' | 'acquisition'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-neutral-900">
                WorthWyl Creative OS — Technical Architecture & Acquisition Spec
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5 font-mono">
              Target Infrastructure: Microsoft Azure Cloud Platform (AKS + Istio + KeyVault)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-neutral-200 bg-white px-5 gap-4">
          {(
            [
              { id: 'architecture', label: 'Microservice Constellation' },
              { id: 'contracts', label: 'Core Contracts (APIs)' },
              { id: 'k8s', label: 'Kubernetes & Istio Mesh' },
              { id: 'acquisition', label: 'Acquisition / Due Diligence' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-bold transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-700 flex-1">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                  Unified Creative OS Paradigm
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Unlike fragmented creator utilities (DAWs, word processors, video editors), WorthWyl Creative OS
                  integrates cognitive feedback, media rendering, and generational storage into an orchestrated microservice constellation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    1. Cranium Core Supercluster
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    ML serving layer (vLLM / KServe) evaluating real-time emotional baseline, tension, coherence, continuity, and theme drift. Latency benchmark &lt; 150ms.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Server className="w-4 h-4 text-indigo-600" />
                    2. High-IO Media Pipeline
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    GPU-accelerated MP4 assembly with resumable Kubernetes workers, streaming chunked speech synthesis, and 3-stage caching (Timeline → Audio → MP4).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Layers className="w-4 h-4 text-purple-600" />
                    3. Creator Studio & BFF
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Orchestrated Backend-For-Frontend (BFF) delivering WebSocket updates for multi-track waveform state, script beat tone suggestions, and command palettes.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Shield className="w-4 h-4 text-amber-600" />
                    4. Generational Miracle Archive
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Durable generational storage using AES-256 double envelope encryption in Azure KeyVault, time-capsule date locks, and immutable manifest hashes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-xs overflow-x-auto">
                <div className="text-emerald-400 font-bold mb-2">// POST /api/core/analyze</div>
                <div>Request: {'{'} text: string, audioUrl?: string, projectId: string {'}'}</div>
                <div className="text-neutral-400 mt-1">Response:</div>
                <div className="text-neutral-300">
                  {'{'}
                  <br />
                  &nbsp;&nbsp;emotion: EmotionScore, // [-1.0 to 1.0]
                  <br />
                  &nbsp;&nbsp;narrative: NarrativeStructure, // Act beats
                  <br />
                  &nbsp;&nbsp;directives: ['STABILIZE' | 'ESCALATE' | 'SHIFT_THEME' | 'ADVANCE'],
                  <br />
                  &nbsp;&nbsp;confidence: 0.965
                  <br />
                  {'}'}
                </div>
              </div>

              <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-xs overflow-x-auto">
                <div className="text-indigo-400 font-bold mb-2">// POST /api/media/render</div>
                <div>Request: {'{'} projectId: string, timeline: TimelineSpec {'}'}</div>
                <div className="text-neutral-400 mt-1">Response:</div>
                <div className="text-neutral-300">
                  {'{'} jobId: "job_8829", status: "queued", estimatedSec: 3.8 {'}'}
                </div>
              </div>

              <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-xs overflow-x-auto">
                <div className="text-amber-400 font-bold mb-2">// POST /api/legacy/archive</div>
                <div>Request: {'{'} assetId: string, policy: LegacyPolicy {'}'}</div>
                <div className="text-neutral-400 mt-1">Response:</div>
                <div className="text-neutral-300">
                  {'{'} entryId: "miracle_001", encrypted: true, indexed: true {'}'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'k8s' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Kubernetes (AKS) Cluster Topology
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">worthwyl-core</div>
                  <div className="text-neutral-500 mt-1">Cranium loop, model-serving, Qdrant/pgvector</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">worthwyl-media</div>
                  <div className="text-neutral-500 mt-1">Media API, GPU render workers, chunk cache</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">worthwyl-legacy</div>
                  <div className="text-neutral-500 mt-1">Miracle vault, AES-256 encryption, search</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">worthwyl-studio</div>
                  <div className="text-neutral-500 mt-1">Studio BFF, React front-end, WebSockets</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">worthwyl-edge</div>
                  <div className="text-neutral-500 mt-1">Azure Front Door, Envoy ingress, rate limiting</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">worthwyl-platform</div>
                  <div className="text-neutral-500 mt-1">Istio mTLS, Prometheus, Jaeger, OpenTelemetry</div>
                </div>
              </div>

              <div className="p-4 bg-neutral-900 text-neutral-300 font-mono text-xs rounded-xl overflow-x-auto">
                <div className="text-neutral-400 font-bold mb-1"># Istio VirtualService Route Spec</div>
                <div>apiVersion: networking.istio.io/v1alpha3</div>
                <div>kind: VirtualService</div>
                <div>metadata: name: worthwyl-gateway</div>
                <div>spec:</div>
                <div>&nbsp;&nbsp;hosts: ["*"]</div>
                <div>&nbsp;&nbsp;http:</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;- match: [{'{'} uri: {'{'} prefix: /api/core {'}'} {'}'}]</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;route: [{'{'} destination: {'{'} host: cranium-core-api, port: 8080 {'}'} {'}'}]</div>
              </div>
            </div>
          )}

          {activeTab === 'acquisition' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Strategic Value to Microsoft / Azure
                </div>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Positions Microsoft with a category-defining creative operating system directly integrated with Azure AI,
                  OneDrive storage, Copilot assistant, and Surface creative hardware.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">Pre-Revenue IP Posture</div>
                  <div className="text-neutral-600 mt-1">
                    Documented behavioral contract, quarantine boundary, immune incidents, and deterministic resonance field.
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">Clean Intellectual Property</div>
                  <div className="text-neutral-600 mt-1">
                    Self-contained TypeScript/Python contracts, no unauthorized dependencies, scrubbed lineage.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-xs text-neutral-500">WorthWyl OS Architecture v1.0 — Acquisition Grade</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
}
