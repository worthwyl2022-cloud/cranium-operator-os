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

export interface Metrics {
  emotional_baseline: number;
  tension: number;
  coherence: number;
  continuity: number;
  theme_drift: number;
}

export enum Directive {
  STABILIZE = 'STABILIZE',
  ESCALATE = 'ESCALATE',
  SHIFT_THEME = 'SHIFT_THEME',
  ADVANCE = 'ADVANCE',
}

export interface TickRecord {
  cycle: number;
  atom_id: string;
  atom_label?: string;
  metrics: Metrics;
  directives: Directive[];
  timestamp: number;
  contentSnippet?: string;
}

export interface ScriptBeat {
  id: string;
  title: string;
  content: string;
  targetEmotion: 'wonder' | 'tension' | 'catharsis' | 'revelation' | 'grounded';
  suggestedPacing: 'slow' | 'moderate' | 'accelerated';
  atom?: CognitiveAtom;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'voice' | 'music' | 'ambience' | 'sfx' | 'visual_overlay';
  volume: number; // 0 to 1
  muted: boolean;
  clips: TimelineClip[];
}

export interface TimelineClip {
  id: string;
  title: string;
  startSec: number;
  durationSec: number;
  color: string;
  gain: number;
}

export interface MiracleArchiveEntry {
  id: string;
  title: string;
  timestamp: number;
  encrypted: boolean;
  aesKeyFingerprint: string;
  tags: string[];
  cognitiveSnapshot: Metrics;
  timeCapsuleLockedUntil?: number;
  heirloomDesignee?: string;
  manifestHash: string;
  summary: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  format: 'mp4_4k' | 'mp4_vertical' | 'wav_master' | 'podcast_pkg';
  status: 'queued' | 'processing' | 'synthesizing' | 'completed';
  progress: number;
  durationSec: number;
  latencyMs: number;
}

// Story and Episodic Novel Engine Types
export interface EpisodeSnapshot {
  id: string;
  novelId: string;
  episodeNumber: number;
  title: string;
  createdAt: number;
  text: string;
  screenshotUrl: string;
  characters: string[];
  locations: string[];
  tags: string[];
  tone: string;
  pacing: string;
  openThreads: string[];
  resolvedThreads: string[];
}

export interface ContinuityState {
  characters: Record<string, { firstSeen: number; lastSeen: number; arcStatus: string }>;
  locations: Record<string, { firstSeen: number; lastSeen: number }>;
  openThreads: string[];
  resolvedThreads: string[];
}

export interface WorthWylPersona {
  name: string;
  stylePhilosophy: string;
  forbiddenPatterns: string;
  emotionalProfile: {
    intensity: string;
    vulnerability: string;
    darkness: string;
    humor: string;
  };
  pacingPreferences: {
    defaultPacing: string;
    escalationCurve: string;
    sceneLength: string;
  };
  genreModes: string[];
}

// Metacognitive Types
export interface MetacognitiveEntry {
  id: string;
  createdAt: string;
  situation: string;
  trigger: string;
  thought: string;
  assumption: string;
  emotion: string;
  confidence: number;
  action_taken: string;
  outcome: string;
  self_editing: boolean;
  shrank_self: boolean;
  engaged_true_self: boolean;
  walked_away: boolean;
  overexplained: boolean;
  awareness_level: number;
  intensity: number;
  tags: string[];
  suggestedPrompt?: string;
}

export interface MetacognitiveReview {
  id: string;
  period: string;
  periodLabel: string;
  summary: string;
  primaryDistortions: string[];
  topEmotions: { emotion: string; count: number }[];
  shrinkRate: number;
  overexplainRate: number;
  engagedRate: number;
  testableExperiment: string;
}

// Thought Journal Types
export type CognitiveFocusArea =
  | 'Creative Sovereignty'
  | 'Canon Integrity'
  | 'Identity & Voice'
  | 'Narrative Architecture'
  | 'Boundary Setting'
  | 'Strategic Posture'
  | 'Emotional Regulation'
  | 'Conflict as Signal';

export interface ThoughtJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  title: string;
  content: string;
  emotionalIntensity: number; // 1 to 10
  primaryEmotion: string;
  cognitiveFocus: CognitiveFocusArea | string;
  secondaryFocusTags: string[];
  reframingInsight?: string;
  actionDirective?: string;
}
