import { CognitiveAtom, Metrics } from '../../types/creativeOs';
import { ThemeMemory } from './themeMemory';
import { emotionalBaseline, tensionAndCoherence } from './physics';
import { continuityScore } from './continuity';

export class ResonanceField {
  private atoms: CognitiveAtom[] = [];
  private themeMemory = new ThemeMemory();

  constructor(initialAtoms: CognitiveAtom[] = []) {
    if (initialAtoms.length > 0) {
      this.atoms = [...initialAtoms];
      this.themeMemory.ingest(initialAtoms);
    }
  }

  inject(atom: CognitiveAtom): void {
    this.atoms.push(atom);
    if (atom.kind === 'theme') {
      this.themeMemory.ingest([atom]);
    }
  }

  remove(atomId: string): void {
    this.atoms = this.atoms.filter(a => a.id !== atomId);
  }

  clear(): void {
    this.atoms = [];
    this.themeMemory = new ThemeMemory();
  }

  getAtoms(): CognitiveAtom[] {
    return [...this.atoms];
  }

  metrics(): Metrics {
    const baseline = emotionalBaseline(this.atoms);
    const [tension, coherence] = tensionAndCoherence(this.atoms);
    const continuity = continuityScore(this.atoms);
    const themeDrift = this.themeMemory.calculateDrift(this.atoms);

    return {
      emotional_baseline: baseline,
      tension,
      coherence,
      continuity,
      theme_drift: Number(themeDrift.toFixed(3)),
    };
  }
}
