import { CognitiveAtom } from '../../types/creativeOs';

export function emotionalBaseline(atoms: CognitiveAtom[]): number {
  if (atoms.length === 0) return 0.0;

  let totalMass = 0;
  let raw = 0;

  for (const a of atoms) {
    const m = Math.max(0.0, Math.min(a.mass, 10.0));
    raw += a.charge * m;
    totalMass += m;
  }

  if (totalMass === 0.0) return 0.0;
  // Dampened non-linear response (0.7 factor)
  return Number(((raw / totalMass) * 0.7).toFixed(3));
}

export function tensionAndCoherence(atoms: CognitiveAtom[]): [number, number] {
  if (atoms.length === 0) return [0.0, 1.0];

  let tension = 0.0;
  let totalMass = 0.0;

  for (const a of atoms) {
    const m = Math.max(0.0, Math.min(a.mass, 10.0));
    tension += Math.abs(a.charge) * m;
    totalMass += m;
  }

  tension = totalMass > 0 ? tension / totalMass : 0.0;

  let coherencePenalty = 0.0;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a = atoms[i];
      const b = atoms[j];
      // Opposite charge collisions with high aggregate mass cause narrative dissonance
      if (a.charge * b.charge < 0) {
        const collisionEnergy = (Math.abs(a.charge) + Math.abs(b.charge)) * (a.mass + b.mass);
        if (collisionEnergy > 10.0) {
          coherencePenalty += 0.08;
        }
      }
    }
  }

  const coherence = Math.max(0.05, 1.0 - coherencePenalty);
  return [Number(tension.toFixed(3)), Number(coherence.toFixed(3))];
}
