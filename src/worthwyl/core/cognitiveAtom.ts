export interface CognitiveAtom {
  id: string;
  label?: string;
  charge: number; // emotional valence (-1.0 to 1.0)
  mass: number; // importance/weight (0.0 to 20.0)
  velocity: number; // change rate (0.0 to 1.0)
  tags: Set<string> | string[]; // semantic / thematic tags
  kind: 'theme' | 'episodic';
  content?: string;
  timestamp?: number;
}

