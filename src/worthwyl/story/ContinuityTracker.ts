import { EpisodeSnapshot, ContinuityState } from './domain';

export class ContinuityTracker {
  /**
   * Rebuilds the global continuity state across all chronologically ordered snapshots of a novel.
   */
  static buildState(allSnapshotsForNovel: EpisodeSnapshot[]): ContinuityState {
    const characters: Record<string, { firstSeen: number; lastSeen: number; arcStatus?: string }> = {};
    const locations: Record<string, { firstSeen: number; lastSeen: number }> = {};
    const openSet = new Set<string>();
    const resolvedSet = new Set<string>();

    const sorted = [...allSnapshotsForNovel].sort((a, b) => a.episodeNumber - b.episodeNumber);
    const totalEpisodes = sorted.length;

    for (const snap of sorted) {
      // Track characters
      if (Array.isArray(snap.characters)) {
        for (const char of snap.characters) {
          const trimmed = char.trim();
          if (!trimmed) continue;
          if (!characters[trimmed]) {
            characters[trimmed] = {
              firstSeen: snap.episodeNumber,
              lastSeen: snap.episodeNumber,
              arcStatus: snap.episodeNumber === totalEpisodes ? "Active Lead / In Focus" : "Established In Canon"
            };
          } else {
            characters[trimmed].lastSeen = snap.episodeNumber;
            if (snap.episodeNumber === totalEpisodes) {
              characters[trimmed].arcStatus = "Active Lead / In Focus";
            }
          }
        }
      }

      // Track locations
      if (Array.isArray(snap.locations)) {
        for (const loc of snap.locations) {
          const trimmed = loc.trim();
          if (!trimmed) continue;
          if (!locations[trimmed]) {
            locations[trimmed] = {
              firstSeen: snap.episodeNumber,
              lastSeen: snap.episodeNumber
            };
          } else {
            locations[trimmed].lastSeen = snap.episodeNumber;
          }
        }
      }

      // Track narrative threads
      if (Array.isArray(snap.openThreads)) {
        for (const ot of snap.openThreads) {
          const clean = ot.trim();
          if (clean) openSet.add(clean);
        }
      }

      if (Array.isArray(snap.resolvedThreads)) {
        for (const rt of snap.resolvedThreads) {
          const clean = rt.trim();
          if (clean) {
            openSet.delete(clean);
            resolvedSet.add(clean);
          }
        }
      }
    }

    return {
      characters,
      locations,
      openThreads: Array.from(openSet),
      resolvedThreads: Array.from(resolvedSet)
    };
  }

  /**
   * Resolves an open thread and moves it to resolved threads
   */
  static resolveThread(current: ContinuityState, thread: string): ContinuityState {
    const nextOpen = current.openThreads.filter(t => t !== thread);
    const nextResolved = current.resolvedThreads.includes(thread)
      ? current.resolvedThreads
      : [thread, ...current.resolvedThreads];

    return {
      ...current,
      openThreads: nextOpen,
      resolvedThreads: nextResolved
    };
  }
}
