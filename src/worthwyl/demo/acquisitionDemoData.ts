export interface DemoChapter {
  id: string;
  act: string;
  title: string;
  durationSec: number;
  narratorVoiceText: string;
  captions: string[];
  keyHighlights: {
    metric: string;
    label: string;
    description: string;
  }[];
  visualMode: 'physics' | 'novel' | 'metacognitive' | 'architecture' | 'summary';
}

export const DEMO_CHAPTERS: DemoChapter[] = [
  {
    id: "act-1",
    act: "Act I",
    title: "The Creative Bottleneck & The Behavioral Contract",
    durationSec: 18,
    narratorVoiceText: "Welcome to WorthWyl Creative OS. Today's creative tools treat artificial intelligence as a disposable chat generator. In long-running projects, models drift, character arcs collapse, and creative intent is diluted. WorthWyl introduces Cranium Core, the world's first directive-governed cognitive substrate that treats canon, identity, and intent as first-class constraints.",
    captions: [
      "Current generative tools suffer from canon amnesia and narrative drift.",
      "Cranium Core establishes an immutable behavioral contract between author and machine.",
      "Intent, canon, and emotional logic are enforced as first-class physical constraints."
    ],
    keyHighlights: [
      { metric: "100%", label: "Constraint Guarantee", description: "Identity and canon cannot be overridden by conversational drift." },
      { metric: "0.90", label: "Coherence Floor", description: "Calibrated threshold enforcing strict multi-episode integrity." },
      { metric: "4 Core", label: "Subsystem Pillars", description: "Cranium Core, Media Engine, Studio, and Miracle Archive." }
    ],
    visualMode: "summary"
  },
  {
    id: "act-2",
    act: "Act II",
    title: "Resonance Field Physics & Automated Directives",
    durationSec: 22,
    narratorVoiceText: "Observe the Resonance Field in action. Narrative events are not stored as plain text strings—they are modeled as Cognitive Atoms, with emotional charge, mass, and velocity. The engine computes real-time tension, coherence, and theme drift. When tension drops below threshold, Cranium Core issues an automated ESCALATE directive. When coherence fractures, it issues STABILIZE.",
    captions: [
      "Cognitive Atoms model narrative energy: charge (-1.0 to 1.0), mass, and velocity.",
      "The physics engine evaluates collisions between opposite emotional polarities.",
      "The loop autonomously fires directives: STABILIZE, ESCALATE, SHIFT_THEME, ADVANCE."
    ],
    keyHighlights: [
      { metric: "0.08", label: "Tension Floor", description: "Prevents flatlining narrative momentum across episodes." },
      { metric: "0.35", label: "Drift Ceiling", description: "Triggers SHIFT_THEME if recent beats detach from core motif." },
      { metric: "Real-Time", label: "Directive Governance", description: "Deterministic control layer steering external generation models." }
    ],
    visualMode: "physics"
  },
  {
    id: "act-3",
    act: "Act III",
    title: "The Episodic Novel Engine & Visual Coherence",
    durationSec: 22,
    narratorVoiceText: "In the Creator Studio, the engine crafts multi-episode serialized narratives. Notice how every generated episode is instantly rendered into a visual typographic snapshot. Our visual cortex analyzes layout density and visual pacing shifts. Character arcs from first appearance to current conflict are mapped automatically, while open and resolved plot threads are governed with zero loss.",
    captions: [
      "Continuous serialized generation preserving character timelines and location history.",
      "Visual Cortex renders typographic snapshot cards to inspect visual density & pacing.",
      "Multi-thread tracker guarantees no plot threads are dropped or arbitrarily forgotten."
    ],
    keyHighlights: [
      { metric: "100% Retained", label: "Character Lineage", description: "Tracks firstSeen, lastSeen, and conflict progression." },
      { metric: "Dual Cortex", label: "Visual + Text Hybrid", description: "Detects pacing drift through both linguistic and layout density." },
      { metric: "3-5 Epoch", label: "Episodic Spine", description: "ContextBuilder synthesizes recent canon with active persona philosophy." }
    ],
    visualMode: "novel"
  },
  {
    id: "act-4",
    act: "Act IV",
    title: "The Metacognitive Tracker: Self-Awareness for Creators",
    durationSec: 22,
    narratorVoiceText: "The creator is the soul of the machine. The Metacognitive Tracker is a private self-awareness instrument built into the OS. It allows creators to log moments of hesitation, self-shrinking, overexplaining, or retreat in under sixty seconds. The pattern engine synthesizes these logs into plain-language truths, revealing where fear distorts decision-making.",
    captions: [
      "60-second structured capture: situation, trigger, thought, assumption, and outcome.",
      "Audits self-shrinking, overexplaining, and emotional retreat in high-stakes creative moments.",
      "Weekly review engine surfaces recurring blind spots and prescribes testable experiments."
    ],
    keyHighlights: [
      { metric: "38%", label: "Shrinking Detection", description: "Identifies behavioral regressions during high-status stakeholder meetings." },
      { metric: "60-Second", label: "Zero-Friction Logging", description: "Instant capture card engineered for busy founders and artists." },
      { metric: "Testable Micro-Action", label: "Behavioral Growth", description: "Transforms messy creative doubts into clear, disciplined conviction." }
    ],
    visualMode: "metacognitive"
  },
  {
    id: "act-5",
    act: "Act V",
    title: "Enterprise Architecture & Acquisition Diligence",
    durationSec: 20,
    narratorVoiceText: "WorthWyl Creative OS is engineered as an enterprise-grade microservice constellation. Designed for Azure Kubernetes Service, it integrates Istio service mesh, Redis caching, and AES-256 encrypted Miracle Archive storage. With zero debt and verifiable behavioral contracts, it represents an acquisition-ready strategic bridge for Microsoft Copilot and Azure AI.",
    captions: [
      "Microservice topology built for Azure Kubernetes Service with Istio service mesh.",
      "Encrypted Miracle Archive preserving generational creative assets with AES-256.",
      "Clean IP, honest diligence validation, and turnkey integration into Microsoft's ecosystem."
    ],
    keyHighlights: [
      { metric: "AKS Ready", label: "Enterprise Topology", description: "Isolated namespaces for Core, Media, Studio, and Legacy." },
      { metric: "AES-256", label: "Miracle Archive", description: "Generational encrypted storage with immutable provenance." },
      { metric: "Category 1st", label: "Creative OS Moat", description: "Positions acquirer to lead creative cognition rather than commodity chatbots." }
    ],
    visualMode: "architecture"
  }
];
