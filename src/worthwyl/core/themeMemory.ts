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
}
