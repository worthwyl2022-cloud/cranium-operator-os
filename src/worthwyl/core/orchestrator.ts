import { CognitiveAtom, Directive, Metrics, TickRecord } from '../../types/creativeOs';
import { CraniumLoop } from './loop';

// Deterministic local lexical feature extractor. This is a real bounded
// feature computation, not an authority decision.
export class LocalFeatureProvider {
  embed(text: string): number[] {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i++) {
      const ch = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const vec: number[] = [];
    let seed = (h1 >>> 0) + (h2 >>> 0);
    for (let i = 0; i < 16; i++) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      const val = (seed % 256) - 127.5;
      vec.push(val);
    }

    // Normalize
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vec.map(v => v / norm);
  }
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * (b[i] || 0);
  }
  return dot;
}

export class TagSchema {
  static THEMES: Record<string, string[]> = {
    isolation: ['alone', 'solitude', 'separate', 'detached', 'quiet', 'empty'],
    meaning: ['purpose', 'significance', 'value', 'legacy', 'soul', 'truth'],
    conflict: ['fight', 'struggle', 'tension', 'war', 'oppose', 'clash'],
    technology: ['robot', 'machine', 'system', 'device', 'code', 'cyber'],
    space: ['spaceship', 'orbit', 'cosmos', 'astronaut', 'stars', 'void'],
  };
}

export class SemanticTagger {
  private schema = TagSchema.THEMES;
  private embedder: LocalFeatureProvider;
  private themeVectors: Record<string, number[]> = {};

  constructor(embedder: LocalFeatureProvider) {
    this.embedder = embedder;
    for (const [theme, words] of Object.entries(this.schema)) {
      this.themeVectors[theme] = this.embedder.embed(words.join(' '));
    }
  }

  tagsFor(text: string): Set<string> {
    const vec = this.embedder.embed(text);
    const tags = new Set<string>();

    const lower = text.toLowerCase();
    for (const [theme, words] of Object.entries(this.schema)) {
      const directMatch = words.some(w => lower.includes(w));
      const tvec = this.themeVectors[theme];
      const similarity = cosine(vec, tvec);
      if (directMatch || similarity > 0.45) {
        tags.add(theme);
      }
    }

    if (tags.size === 0) {
      tags.add('meaning');
    }
    return tags;
  }
}

export interface ArtifactRecord {
  atom: CognitiveAtom;
  content: string;
  embedding: number[];
}

export class ArtifactMemory {
  private embedder: LocalFeatureProvider;
  records: ArtifactRecord[] = [];
  themeAtoms: CognitiveAtom[] = [];

  constructor(embedder: LocalFeatureProvider) {
    this.embedder = embedder;
  }

  store(atom: CognitiveAtom, content: string): void {
    const embedding = this.embedder.embed(content);
    this.records.push({ atom, content, embedding });
  }

  recentEmbeddings(n: number): number[][] {
    return this.records.slice(-n).map(r => r.embedding);
  }

  promoteToTheme(n: number = 3): CognitiveAtom[] {
    const promoted: CognitiveAtom[] = [];
    const recent = this.records.slice(-n);

    for (const rec of recent) {
      if (rec.atom.kind === 'episodic') {
        const themeAtom: CognitiveAtom = {
          id: `theme_${rec.atom.id}`,
          label: `Theme: ${rec.atom.label || rec.atom.id}`,
          charge: rec.atom.charge,
          mass: rec.atom.mass,
          velocity: rec.atom.velocity,
          tags: rec.atom.tags,
          kind: 'theme',
          content: rec.content,
          timestamp: Date.now(),
        };
        this.themeAtoms.push(themeAtom);
        promoted.push(themeAtom);
      }
    }
    return promoted;
  }
}

export class SteeringContextBuilder {
  build(directives: Directive[], artifactMemory: ArtifactMemory): string {
    const recent = artifactMemory.records.slice(-5);
    const contextLines = recent.map(r => `- ${r.content}`);
    const directiveText = directives.join(' ');
    return `Directives: [${directiveText}]\nRecent Creative Context:\n${contextLines.join('\n')}`;
  }
}

export class CreativeCognitiveSynthesizer {
  generate(prompt: string, directives: Directive[]): string {
    const hasStabilize = directives.includes(Directive.STABILIZE);
    const hasEscalate = directives.includes(Directive.ESCALATE);
    const hasShift = directives.includes(Directive.SHIFT_THEME);

    if (hasStabilize) {
      return `[STABILIZE PROTOCOL]: Narrative coherence disrupted by disparate tonal shifts. Recommended action: Ground the scene in sensory anchor details before introducing new emotional stakes.`;
    }
    if (hasEscalate) {
      return `[ESCALATE PROTOCOL]: Cognitive tension has subsided below critical threshold (inert state). Recommended action: Introduce immediate creative jeopardy, contrast, or decisive choice for the protagonist.`;
    }
    if (hasShift) {
      return `[SHIFT THEME PROTOCOL]: Episodic drift detected outside core canonical motifs. Recommended action: Synthesize emerging thematic tags with permanent canonical memories to establish continuity.`;
    }
    return `[ADVANCE PROTOCOL]: Field resonance stable (Coherence & Continuity optimal). Recommended action: Drive momentum forward along the central narrative arc with rhythmic pacing.`;
  }
}

export class CraniumFullStack {
  embedder: LocalFeatureProvider;
  tagger: SemanticTagger;
  memory: ArtifactMemory;
  steering: SteeringContextBuilder;
  synthesizer: CreativeCognitiveSynthesizer;
  loop: CraniumLoop;

  constructor() {
    this.embedder = new LocalFeatureProvider();
    this.tagger = new SemanticTagger(this.embedder);
    this.memory = new ArtifactMemory(this.embedder);
    this.steering = new SteeringContextBuilder();
    this.synthesizer = new CreativeCognitiveSynthesizer();
    this.loop = new CraniumLoop();
  }

  step(content: string, charge: number = 0.2, mass: number = 1.0, label?: string): {
    record: TickRecord;
    prompt: string;
    output: string;
    promotedThemes?: CognitiveAtom[];
  } {
    const tags = this.tagger.tagsFor(content);
    const atom: CognitiveAtom = {
      id: `atom_${this.loop.cycle + 1}`,
      label: label || `Beat ${this.loop.cycle + 1}`,
      charge,
      mass,
      velocity: 0.5,
      tags,
      kind: 'episodic',
      content,
      timestamp: Date.now(),
    };

    const record = this.loop.tick(atom);
    this.memory.store(atom, content);

    let promotedThemes: CognitiveAtom[] = [];
    if (record.directives.includes(Directive.SHIFT_THEME)) {
      promotedThemes = this.memory.promoteToTheme(3);
      for (const tAtom of promotedThemes) {
        this.loop.field.inject(tAtom);
      }
    }

    const prompt = this.steering.build(record.directives, this.memory);
    const output = this.synthesizer.generate(prompt, record.directives);

    return { record, prompt, output, promotedThemes };
  }
}
