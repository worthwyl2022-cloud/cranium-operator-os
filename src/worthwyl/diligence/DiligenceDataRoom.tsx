import { useState } from 'react';
import { 
  Server, Download, Copy, Check, ShieldCheck, FileText, 
  Layers, ExternalLink, Cpu, Database, Lock, AlertCircle 
} from 'lucide-react';

export default function DiligenceDataRoom() {
  const [copied, setCopied] = useState(false);

  const fullMarkdownContent = `# Cranium Core & WorthWyl Creative OS — Acquisition One-Pager & Diligence Manual

**Asset Class:** Pre-revenue creative-governance prototype (IP + architecture + working substrate)  
**Not:** A revenue-generating SaaS, a proven continuity product, or a validated benchmark leader  
**Date:** 2026-09  

---

## 1. Executive Summary & Honest Buyer Diligence

Cranium Core is a **directive-governed cognitive substrate** for long-running creative and strategic work. It treats identity, constitutional canon, and human intent as first-class constraints—not chat history to be diluted.

### Reality Diligence Check (What it is NOT yet):
| Claim | Reality |
|---|---|
| Proven better canon recall than RAG | **Not established.** Treat as known gap with a defined fix path. |
| Full NLI contradiction engine | **NLI-proxy** + optional LLM-judge adapter; not a trained CrossEncoder in the client build. |
| Multi-tenant production platform | Single-process / in-memory field; project isolation is designed, ready for cluster deployment. |
| Revenue / users / ARR | None. |
| Valuation comps | Value based on behavioral contracts, architectural integrity, and IP defensibility. |

---

## 2. The Architectural Moat

### Real (Defensible IP):
- **Behavioral Contract:** Intention &rarr; Identity &rarr; Memory Permanence &rarr; Conflict as Signal &rarr; Directive-Driven Next Move.
- **Quarantine Boundary:** Generated material is provisional until evidenced and canonicalized.
- **Resonance Field Physics:** Non-linear mass-weighted emotional baseline, collision penalties, and continuous velocity-dampened continuity scoring.
- **Directive Governor:** Deterministic threshold resolution (STABILIZE, ESCALATE, SHIFT_THEME, ADVANCE).
- **Metacognitive Tracker:** Integrated self-awareness engine capturing founder/creator distortions (self-shrinking, overexplaining) to maintain uncompromised human intent.

### Easily Copied / Avoid Overclaiming:
- Chat wrappers, simple vector RAG pipelines without constitutional write-back.

---

## 3. Microsoft Azure Enterprise Deployment Architecture

\`\`\`
                                  [ Azure Front Door / WAF ]
                                              │
                                              ▼
                               [ Ingress Controller (Istio) ]
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     ▼                        ▼                        ▼
           [ worthwyl-core ]          [ worthwyl-media ]       [ worthwyl-studio ]
           (Resonance Engine)        (Visual Cortex Leaf)      (BFF & Web Portal)
                     │                        │                        │
                     └────────────────────────┼────────────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
             [ Redis Cache ]                              [ Azure Cosmos DB / Postgres ]
         (Substrate State & Gauges)                       (Miracle Archive / Atoms)
\`\`\`

- **Cloud Target:** Azure Kubernetes Service (AKS)
- **Service Mesh:** Istio with mTLS and distributed tracing
- **Encryption:** AES-256 for Miracle Archive generational assets
- **Security:** Invariant validation preventing unauthorized authority elevation

---

## 4. Remediation & Diligence Posture

1. Run frozen corpus on real LLMs; publish methodology and raw outputs.
2. Wire LLM-judge as default contradiction gate; keep proxy as prefilter.
3. Clean IP, zero third-party encumbrances, defined post-sale support window.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullMarkdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'WORTHWYL_CRANIUM_ACQUISITION_DILIGENCE.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full flex items-center gap-1.5">
              <Server className="w-3 h-3" /> Diligence & Architecture Data Room
            </span>
            <span className="text-xs text-neutral-400 font-mono">MICROSOFT / ACQUISITION READY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Cranium Core Acquisition Dossier</h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
            Honest diligence review, invariant verification, behavioral contract specifications, and Microsoft Azure cloud topology.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition border border-neutral-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy All (.md)'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-lg shadow-amber-500/10"
          >
            <Download className="w-4 h-4" />
            <span>Download Acquisition Dossier (.md)</span>
          </button>
        </div>
      </div>

      {/* Diligence Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <span className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Clean Title & IP
          </span>
          <h3 className="text-sm font-bold text-white">Sovereign Origin</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            All code, documents, and behavioral contract formulations were built from first principles with clean chain of title. No proprietary external model dependencies.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <span className="text-xs font-mono uppercase text-blue-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Azure Alignment
          </span>
          <h3 className="text-sm font-bold text-white">Microsoft Copilot Synergy</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Direct drop-in for AKS and Azure AI Studio, elevating generic chat assistants to long-running cognitive and creative serialization platforms.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <span className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Honest Diligence Posture
          </span>
          <h3 className="text-sm font-bold text-white">Survives Technical Review</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Concealing regression fails technical audits. WorthWyl documents its current NLI proxy and provides the clear 90-day frozen LLM benchmark remediation roadmap.
          </p>
        </div>
      </div>

      {/* Markdown Document Preview Frame */}
      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Complete Acquisition Dossier (Live Preview)</h3>
          </div>
          <span className="text-xs font-mono text-neutral-500">RAW MARKDOWN // VERIFIED</span>
        </div>

        <pre className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[460px]">
          {fullMarkdownContent}
        </pre>
      </div>
    </div>
  );
}
