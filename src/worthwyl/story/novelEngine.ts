import { EpisodeSnapshot, ContinuityState, WorthWylPersona, Directive } from '../../types/creativeOs';

export const DEFAULT_PERSONA: WorthWylPersona = {
  name: "WorthWyl Core v3",
  stylePhilosophy: "Cinematic pacing, emotional depth, psychological tension, resonant motif recurrence.",
  forbiddenPatterns: "Deus ex machina, tone whiplash, ungrounded dialogue, dropped narrative threads.",
  emotionalProfile: {
    intensity: "dark-psychological",
    vulnerability: "medium-high",
    darkness: "elevated",
    humor: "subtle-wry"
  },
  pacingPreferences: {
    defaultPacing: "medium",
    escalationCurve: "rising-sine",
    sceneLength: "dense"
  },
  genreModes: ["Speculative Noir", "Hard Sci-Fi", "Political Thriller"]
};

export function renderEpisodeToCanvas(
  title: string,
  episodeNum: number,
  excerpt: string,
  tone: string,
  pacing: string
): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Dark sleek gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 640);
    bgGrad.addColorStop(0, '#121316');
    bgGrad.addColorStop(1, '#090a0d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 480, 640);

    // Subtle paper/film frame
    ctx.strokeStyle = '#262930';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, 448, 608);

    // Header stamp
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`WORTHWYL OS // EPISODE ${episodeNum.toString().padStart(2, '0')}`, 32, 48);

    // Tone & Pacing indicator pills
    ctx.fillStyle = '#22252c';
    ctx.fillRect(32, 64, 110, 24);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText(`TONE: ${tone.toUpperCase()}`, 40, 80);

    ctx.fillStyle = '#22252c';
    ctx.fillRect(150, 64, 110, 24);
    ctx.fillStyle = pacing === 'fast' ? '#ef4444' : pacing === 'medium' ? '#eab308' : '#10b981';
    ctx.fillText(`PACING: ${pacing.toUpperCase()}`, 158, 80);

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px serif';
    ctx.fillText(title, 32, 126);

    // Thin accent line
    ctx.fillStyle = '#334155';
    ctx.fillRect(32, 142, 416, 1);

    // Body text (chunked wrap)
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px serif';
    const words = excerpt.split(' ');
    let line = '';
    let y = 175;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 410 && i > 0) {
        ctx.fillText(line, 32, y);
        line = words[i] + ' ';
        y += 20;
        if (y > 560) break;
      } else {
        line = testLine;
      }
    }
    if (y <= 560) {
      ctx.fillText(line, 32, y);
    }

    // Watermark footer
    ctx.fillStyle = '#475569';
    ctx.font = '9px monospace';
    ctx.fillText("CRANIUM CORE EPISODIC SNAPSHOT // CANON SEALED", 32, 600);

    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error("Canvas render error:", e);
    return '';
  }
}

export const INITIAL_EPISODES: EpisodeSnapshot[] = [
  {
    id: "ep-001",
    novelId: "novel-worthwyl-genesis",
    episodeNumber: 1,
    title: "The Silent Perimeter",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    text: "The telemetry array above Sector Nine hummed with a low, hydraulic pulse. Kaelan adjusted the polarization on his visor, staring into the static curtain where the communications relay used to anchor. 'There is no signal loss,' he murmured to the recorder. 'The frequency hasn't degraded. It's simply been severed from the interior.' Behind him, Dr. Vane did not look up from the core diagnostic. She already knew what the diagnostic would say.",
    screenshotUrl: "",
    characters: ["Kaelan Thorne", "Dr. Mira Vane"],
    locations: ["Sector Nine", "The Relay Basin"],
    tags: ["isolation", "subversion", "telemetry"],
    tone: "dark",
    pacing: "medium",
    openThreads: ["The severed interior relay", "Vane's concealed core diagnostic"],
    resolvedThreads: []
  },
  {
    id: "ep-002",
    novelId: "novel-worthwyl-genesis",
    episodeNumber: 2,
    title: "A Fracture in the Ledger",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    text: "At 03:00 local time, the atmospheric dampers stuttered. Kaelan found the physical bypass locked with an old biometric imprint—one registered to a commander listed missing seven operational cycles ago. 'If you force the valve,' Vane warned, her voice flat against the hiss of venting coolant, 'the pressure differential will purge the local memory banks.' Kaelan kept his hand on the lever. 'Good. Let's see what is hiding underneath the canon.'",
    screenshotUrl: "",
    characters: ["Kaelan Thorne", "Dr. Mira Vane", "Commander Ren (Mentioned)"],
    locations: ["Ventilation Node 4", "Sub-Basement Archive"],
    tags: ["conflict", "technology", "identity", "secrecy"],
    tone: "dark",
    pacing: "fast",
    openThreads: ["The severed interior relay", "The missing commander's active biometric bypass"],
    resolvedThreads: ["Vane's concealed core diagnostic"]
  },
  {
    id: "ep-003",
    novelId: "novel-worthwyl-genesis",
    episodeNumber: 3,
    title: "Resonance Threshold",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    text: "The archive did not contain files; it contained mirrors. Not physical glass, but harmonic resonant arrays that echoed back electromagnetic thought patterns before they were spoken aloud. Kaelan stepped onto the gantry, feeling the pull of the field in the fillings of his teeth. 'This isn't an automated defense,' he realized. 'It is an immune response.'",
    screenshotUrl: "",
    characters: ["Kaelan Thorne", "Dr. Mira Vane", "The Architect (Presumed)"],
    locations: ["The Harmonic Vault", "Resonance Gantry"],
    tags: ["meaning", "space", "resonance", "coherence"],
    tone: "reflective",
    pacing: "slow",
    openThreads: ["The severed interior relay", "The Architect's automated immune system"],
    resolvedThreads: ["The missing commander's active biometric bypass"]
  }
];

export function buildContinuityState(snapshots: EpisodeSnapshot[]): ContinuityState {
  const characters: Record<string, { firstSeen: number; lastSeen: number; arcStatus: string }> = {};
  const locations: Record<string, { firstSeen: number; lastSeen: number }> = {};
  const openSet = new Set<string>();
  const resolvedSet = new Set<string>();

  for (const snap of snapshots) {
    for (const c of snap.characters) {
      if (!characters[c]) {
        characters[c] = {
          firstSeen: snap.episodeNumber,
          lastSeen: snap.episodeNumber,
          arcStatus: snap.episodeNumber === snapshots.length ? "Active / In Conflict" : "Established"
        };
      } else {
        characters[c].lastSeen = snap.episodeNumber;
      }
    }

    for (const l of snap.locations) {
      if (!locations[l]) {
        locations[l] = { firstSeen: snap.episodeNumber, lastSeen: snap.episodeNumber };
      } else {
        locations[l].lastSeen = snap.episodeNumber;
      }
    }

    for (const ot of snap.openThreads) openSet.add(ot);
    for (const rt of snap.resolvedThreads) {
      openSet.delete(rt);
      resolvedSet.add(rt);
    }
  }

  return {
    characters,
    locations,
    openThreads: Array.from(openSet),
    resolvedThreads: Array.from(resolvedSet)
  };
}

export function synthesizeNextEpisode(
  recentSnapshots: EpisodeSnapshot[],
  persona: WorthWylPersona,
  activeDirectives: Directive[]
): {
  title: string;
  text: string;
  tone: string;
  pacing: "slow" | "medium" | "fast";
  characters: string[];
  locations: string[];
  tags: string[];
  openThreads: string[];
  resolvedThreads: string[];
} {
  const nextNum = recentSnapshots.length + 1;
  const isEscalation = activeDirectives.includes(Directive.ESCALATE);
  const isStabilize = activeDirectives.includes(Directive.STABILIZE);
  const isShift = activeDirectives.includes(Directive.SHIFT_THEME);

  let title = `Episode ${nextNum}: Echo Chamber`;
  let tone = "dark";
  let pacing: "slow" | "medium" | "fast" = "medium";
  let characters = ["Kaelan Thorne", "Dr. Mira Vane"];
  let locations = ["Inner Core Sanctuary"];
  let tags = ["coherence", "continuity", "resonance"];
  let openThreads: string[] = [];
  let resolvedThreads: string[] = [];

  if (isEscalation) {
    title = `Episode ${nextNum}: Ignition Cascade`;
    pacing = "fast";
    tone = "tense";
    locations = ["Breach Corridor Alpha"];
    tags = ["conflict", "escalation", "crisis"];
    openThreads = ["Containment seal failure", "Direct collision with the core intelligence"];
    resolvedThreads = ["The severed interior relay"];
  } else if (isStabilize) {
    title = `Episode ${nextNum}: The Restored Axis`;
    pacing = "slow";
    tone = "somber";
    locations = ["The Observation Dome"];
    tags = ["coherence", "stabilization", "meaning"];
    openThreads = ["Long-term survival parameters"];
    resolvedThreads = ["The Architect's automated immune system"];
  } else if (isShift) {
    title = `Episode ${nextNum}: Tangent Vector`;
    pacing = "medium";
    tone = "speculative";
    characters = ["Kaelan Thorne", "Elena Ramos (Archivist)"];
    locations = ["The Subterranean Library"];
    tags = ["history", "thematic-shift", "discovery"];
    openThreads = ["Ancient operational directives discovered"];
  } else {
    title = `Episode ${nextNum}: The Sovereign Core`;
    pacing = "medium";
    tone = "resolute";
    locations = ["Central Chamber"];
    tags = ["advance", "continuity", "purpose"];
    openThreads = ["The next destination across the rift"];
    resolvedThreads = ["The severed interior relay"];
  }

  const generatedStory = `The threshold readings surged past calibrated safety margins as Directive ${activeDirectives[0] || 'ADVANCE'} resonated across the instrumentation. Kaelan felt the cold stillness of ${locations[0]} settle in his chest. Dr. Vane's fingers danced over the glyph interface, her expression hardening into absolute focus.\n\n"If the core directives dictate ${activeDirectives[0] || 'continuation'}," she said, "we do not retreat. We calibrate the resonance."\n\nAround them, the chamber responded—not with hostile force, but with the sudden, breathtaking coherence of a mind awakening to its own rules.`;

  return {
    title,
    text: generatedStory,
    tone,
    pacing,
    characters,
    locations,
    tags,
    openThreads,
    resolvedThreads
  };
}
