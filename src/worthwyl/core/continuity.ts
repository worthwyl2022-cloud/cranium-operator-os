import { CognitiveAtom } from '../../types/creativeOs';

/**
 * Continuity score with atom velocity and repetition window analysis.
 * - High repetition: loop/stagnation penalty
 * - Low repetition: lack of connective thread
 * - Velocity modulation: higher velocity stabilizes momentum while penalizing abrupt stops
 */
export function continuityScore(atoms: CognitiveAtom[], windowSize: number = 20): number {
  const windowAtoms = atoms.slice(-windowSize);
  if (windowAtoms.length < 2) return 0.5;

  const allTags = windowAtoms.flatMap(a => (Array.isArray(a.tags) ? a.tags : Array.from(a.tags)));
  const uniqueTags = new Set(allTags);
  const totalTags = allTags.length;

  if (totalTags === 0) return 0.4;

  const repetitionRatio = (totalTags - uniqueTags.size) / totalTags;
  
  let baseScore = 0.7;
  if (repetitionRatio > 0.7) {
    baseScore = 0.25; // looping / repetitive narrative
  } else if (repetitionRatio < 0.1) {
    baseScore = 0.35; // erratic / disjointed shifts
  } else {
    baseScore = 0.85; // healthy narrative progression with recurring motif
  }

  // Velocity dampening: dynamic changes across atoms
  const avgVelocity = windowAtoms.reduce((acc, a) => acc + (a.velocity || 0.5), 0) / windowAtoms.length;
  const velocityModifier = (avgVelocity - 0.5) * 0.15;

  return Math.max(0.05, Math.min(0.98, Number((baseScore + velocityModifier).toFixed(3))));
}
