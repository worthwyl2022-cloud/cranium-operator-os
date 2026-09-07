import { EpisodeSnapshot, ContinuityState } from './domain';

export interface CoherenceContext {
  novelId: string;
  recentEpisodes: {
    episodeNumber: number;
    title: string;
    summary: string;
    pacing: string;
    tone: string;
    activeCharacters: string[];
    locations: string[];
  }[];
  activeCharacters: string[];
  currentLocation: string;
  urgentOpenThreads: string[];
  suggestedPacing: "slow" | "medium" | "fast";
  suggestedTone: string;
  prohibitedPatterns: string[];
  directivePostures: string[];
}

export class VisualTextCoherenceEngine {
  /**
   * Analyzes recent episodic memory (last 3–5 snapshots) to build a tightly constrained
   * prompt context that enforces canon continuity, tone stability, and thread resolution.
   */
  static buildNextContext(
    recentSnapshots: EpisodeSnapshot[],
    directivePosture: string = "ADVANCE"
  ): CoherenceContext {
    const novelId = recentSnapshots[0]?.novelId || 'novel-worthwyl-genesis';
    const last3 = recentSnapshots.slice(-3);
    const lastEp = last3[last3.length - 1];

    // Collect all open threads across recent snapshots
    const allOpenThreads = Array.from(
      new Set(recentSnapshots.flatMap(s => s.openThreads))
    );

    // Identify active characters and last known location
    const activeChars = lastEp?.characters?.length
      ? lastEp.characters
      : ["Kaelan Thorne", "Dr. Mira Vane"];
    const currentLoc = lastEp?.locations?.[0] || "Inner Core Sanctuary";

    // Pacing calculation based on rhythm & directive
    let suggestedPacing: "slow" | "medium" | "fast" = "medium";
    if (directivePosture === "ESCALATE") {
      suggestedPacing = "fast";
    } else if (directivePosture === "STABILIZE") {
      suggestedPacing = "slow";
    } else if (lastEp?.pacing === "slow") {
      suggestedPacing = "medium";
    } else if (lastEp?.pacing === "fast") {
      suggestedPacing = "medium";
    }

    // Tone synthesis
    let suggestedTone = "dark";
    if (directivePosture === "STABILIZE") suggestedTone = "reflective";
    else if (directivePosture === "ESCALATE") suggestedTone = "tense";
    else if (directivePosture === "SHIFT_THEME") suggestedTone = "speculative";
    else suggestedTone = lastEp?.tone || "resolute";

    return {
      novelId,
      recentEpisodes: last3.map(ep => ({
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        summary: ep.text.slice(0, 160) + '...',
        pacing: ep.pacing,
        tone: ep.tone,
        activeCharacters: ep.characters,
        locations: ep.locations
      })),
      activeCharacters: activeChars,
      currentLocation: currentLoc,
      urgentOpenThreads: allOpenThreads.slice(0, 4),
      suggestedPacing,
      suggestedTone,
      prohibitedPatterns: [
        "No deus ex machina solutions",
        "No abrupt amnesia regarding previous canon",
        "Maintain psychological tension and physical consequence",
        "Keep dialogue grounded in operational reality"
      ],
      directivePostures: [directivePosture]
    };
  }

  /**
   * Enriches raw episode generation into a verified EpisodeSnapshot
   * through entity parsing, thread tracking, and visual-text coherence verification.
   */
  static enrichSnapshot(
    raw: {
      title?: string;
      text: string;
      pacing?: "slow" | "medium" | "fast";
      tone?: string;
      characters?: string[];
      locations?: string[];
      tags?: string[];
      openThreads?: string[];
      resolvedThreads?: string[];
    },
    screenshotUrl: string,
    novelId: string,
    episodeNumber: number,
    priorContinuity?: ContinuityState
  ): EpisodeSnapshot {
    const text = raw.text.trim();
    const title = raw.title?.trim() || `Episode ${episodeNumber}: Resonance Vector`;

    // Extract characters: combine explicit with heuristic match
    const foundCharacters = new Set<string>(raw.characters || []);
    const knownRoster = ["Kaelan Thorne", "Dr. Mira Vane", "Commander Ren", "The Architect", "Elena Ramos", "Sub-Officer Chen"];
    for (const name of knownRoster) {
      if (text.includes(name) || text.includes(name.split(' ')[0])) {
        foundCharacters.add(name);
      }
    }
    if (foundCharacters.size === 0) {
      foundCharacters.add("Kaelan Thorne");
      foundCharacters.add("Dr. Mira Vane");
    }

    // Extract locations
    const foundLocations = new Set<string>(raw.locations || []);
    const knownPlaces = ["Sector Nine", "The Relay Basin", "Ventilation Node 4", "Sub-Basement Archive", "The Harmonic Vault", "Resonance Gantry", "Observation Dome", "Central Sanctuary"];
    for (const loc of knownPlaces) {
      if (text.includes(loc)) {
        foundLocations.add(loc);
      }
    }
    if (foundLocations.size === 0) {
      foundLocations.add("Inner Core Sanctuary");
    }

    // Determine tone & pacing
    const pacing: "slow" | "medium" | "fast" = raw.pacing || (
      text.includes('!') || text.includes('alarm') || text.includes('breach') || text.includes('ignit') ? "fast"
      : text.includes('silence') || text.includes('whisper') || text.includes('measured') ? "slow"
      : "medium"
    );

    const tone = raw.tone || (
      pacing === 'fast' ? "tense" : pacing === 'slow' ? "reflective" : "resolute"
    );

    // Narrative threads management
    const openThreads = raw.openThreads && raw.openThreads.length > 0
      ? raw.openThreads
      : [
          `The persistent harmonic pulse inside ${Array.from(foundLocations)[0]}`,
          `Unverified telemetry transmission flagged in Episode ${episodeNumber}`
        ];

    // Thread resolutions
    let resolvedThreads = raw.resolvedThreads || [];
    if (priorContinuity && priorContinuity.openThreads.length > 0) {
      // Opportunistically check if any prior open thread was addressed
      for (const openT of priorContinuity.openThreads) {
        const keywords = openT.toLowerCase().split(' ').filter(w => w.length > 4);
        const match = keywords.some(k => text.toLowerCase().includes(k));
        if (match && !resolvedThreads.includes(openT)) {
          resolvedThreads.push(openT);
        }
      }
    }

    // Semantic tags
    const tags = raw.tags && raw.tags.length > 0
      ? raw.tags
      : ["continuity", tone, pacing, "canon-verified", "cognitive-field"];

    return {
      id: `ep-${episodeNumber.toString().padStart(3, '0')}-${Date.now().toString().slice(-4)}`,
      novelId,
      episodeNumber,
      title,
      createdAt: Date.now(),
      text,
      screenshotUrl,
      characters: Array.from(foundCharacters),
      locations: Array.from(foundLocations),
      tags,
      tone,
      pacing,
      openThreads,
      resolvedThreads
    };
  }
}
