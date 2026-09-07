import { Novel, EpisodeSnapshot } from './domain';
import { ScreenshotService } from './ScreenshotService';

const NOVELS_STORAGE_KEY = 'worthwyl_novels_v3';
const SNAPSHOTS_STORAGE_KEY = 'worthwyl_snapshots_v3';

export const SEED_NOVELS: Novel[] = [
  {
    id: "novel-worthwyl-genesis",
    title: "The Sovereign Core",
    genre: "Speculative Noir / Cybernetic Realism",
    status: "in_progress",
    logline: "An engineer uncovers an immune substrate operating inside the telemetry relays of a forgotten orbital ring.",
    createdAt: "2026-08-15T09:00:00Z",
    updatedAt: "2026-09-07T12:00:00Z"
  },
  {
    id: "novel-echoes-gantry",
    title: "Echoes of the Gantry",
    genre: "Hard Sci-Fi / High-Tension Thriller",
    status: "in_progress",
    logline: "When an automated deep-space relay stops responding to human overrides, the archivist must enforce quarantine before memory collapses.",
    createdAt: "2026-08-20T14:30:00Z",
    updatedAt: "2026-09-06T18:15:00Z"
  }
];

export const SEED_SNAPSHOTS: EpisodeSnapshot[] = [
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

export class EpisodicMemoryStore {
  static getNovels(): Novel[] {
    try {
      const data = localStorage.getItem(NOVELS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading novels from localStorage:', e);
    }
    // Initialize seed novels
    this.saveNovels(SEED_NOVELS);
    return SEED_NOVELS;
  }

  static getNovel(id: string): Novel | null {
    const novels = this.getNovels();
    return novels.find(n => n.id === id) || null;
  }

  static saveNovels(novels: Novel[]): void {
    try {
      localStorage.setItem(NOVELS_STORAGE_KEY, JSON.stringify(novels));
    } catch (e) {
      console.error('Error saving novels to localStorage:', e);
    }
  }

  static createNovel(data: { title: string; genre: string; logline?: string }): Novel {
    const novels = this.getNovels();
    const newNovel: Novel = {
      id: `novel-${Date.now()}`,
      title: data.title.trim(),
      genre: data.genre.trim(),
      status: "in_progress",
      logline: data.logline?.trim() || "A new speculative narrative crafted under Cranium Core continuity.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newNovel, ...novels];
    this.saveNovels(updated);
    return newNovel;
  }

  static getAllSnapshots(): EpisodeSnapshot[] {
    try {
      const data = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading snapshots from localStorage:', e);
    }

    // Seed snapshots with rendered screenshots
    const initializedSeeds = SEED_SNAPSHOTS.map(snap => ({
      ...snap,
      screenshotUrl: snap.screenshotUrl || ScreenshotService.capture(
        snap.title,
        snap.episodeNumber,
        snap.text,
        snap.tone,
        snap.pacing,
        "THE SOVEREIGN CORE"
      )
    }));

    this.saveAllSnapshots(initializedSeeds);
    return initializedSeeds;
  }

  static saveAllSnapshots(snapshots: EpisodeSnapshot[]): void {
    try {
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots));
    } catch (e) {
      console.error('Error saving snapshots to localStorage:', e);
    }
  }

  static getSnapshotsForNovel(novelId: string): EpisodeSnapshot[] {
    const all = this.getAllSnapshots();
    return all
      .filter(s => s.novelId === novelId)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  }

  static saveSnapshot(snapshot: EpisodeSnapshot): void {
    const all = this.getAllSnapshots();
    const existingIndex = all.findIndex(s => s.id === snapshot.id);
    let updated: EpisodeSnapshot[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = snapshot;
    } else {
      updated = [...all, snapshot];
    }
    this.saveAllSnapshots(updated);

    // Update novel updatedAt
    const novels = this.getNovels();
    const novelIdx = novels.findIndex(n => n.id === snapshot.novelId);
    if (novelIdx >= 0) {
      novels[novelIdx].updatedAt = new Date().toISOString();
      this.saveNovels(novels);
    }
  }

  static deleteSnapshot(id: string): void {
    const all = this.getAllSnapshots();
    const filtered = all.filter(s => s.id !== id);
    this.saveAllSnapshots(filtered);
  }
}
