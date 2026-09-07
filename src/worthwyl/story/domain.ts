// WorthWyl OS v3 - Domain Models for Novel Engine
export type Novel = {
  id: string;
  title: string;
  genre: string;
  status: "in_progress" | "complete";
  createdAt: string;
  updatedAt: string;
  logline?: string;
};

export type Episode = {
  id: string;
  novelId: string;
  episodeNumber: number;
  text: string;
  createdAt: string;
  title?: string;
};

export type EpisodeSnapshot = {
  id: string;
  novelId: string;
  episodeNumber: number;
  title: string;
  createdAt: number | string;
  text: string;
  screenshotUrl: string;
  characters: string[];
  locations: string[];
  tags: string[];
  tone: string;
  pacing: "slow" | "medium" | "fast";
  openThreads: string[];
  resolvedThreads: string[];
};

export type ContinuityState = {
  characters: Record<string, { firstSeen: number; lastSeen: number; arcStatus?: string }>;
  locations: Record<string, { firstSeen: number; lastSeen: number }>;
  openThreads: string[];
  resolvedThreads: string[];
};

export type OrchestratorStep = {
  stepIndex: number;
  totalSteps: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};
