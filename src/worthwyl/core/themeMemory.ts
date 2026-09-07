import { CognitiveAtom } from './cognitiveAtom';

export class ThemeMemory {
  private counter: Map<string, number> = new Map();
  private total: number = 0;

  ingest(atoms: CognitiveAtom[]): void {
    for (const atom of atoms) {
      if (atom.kind === 'theme') {
        for (const tag of atom.tags) {
          this.counter.set(tag, (this.counter.get(tag) || 0) + 1);
        }
        this.total += 1;
      }
    }
  }

  weights(): Map<string, number> {
    if (this.total === 0) return new Map();
    const weights = new Map<string, number>();
    for (const [tag, count] of this.counter.entries()) {
      weights.set(tag, count / this.total);
    }
    return weights;
  }

  calculateDrift(atoms: CognitiveAtom[]): number {
    if (this.total === 0 || atoms.length === 0) return 0.0;
    const currentWeights = this.weights();
    if (currentWeights.size === 0) return 0.0;

    const recent = atoms.slice(-10);
    const recentTags = recent.flatMap(a => (Array.isArray(a.tags) ? a.tags : Array.from(a.tags)));
    if (recentTags.length === 0) return 0.0;

    let matchScore = 0;
    for (const tag of recentTags) {
      if (currentWeights.has(tag)) {
        matchScore += currentWeights.get(tag) || 0;
      }
    }
    const normalizedMatch = matchScore / recentTags.length;
    const drift = Math.max(0.0, Math.min(1.0, 1.0 - normalizedMatch));
    return Number(drift.toFixed(3));
  }
}
