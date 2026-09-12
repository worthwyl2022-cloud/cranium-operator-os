import { MetacognitiveEntry, MetacognitiveReview, ThoughtJournalEntry, CognitiveFocusArea } from '../../types/creativeOs';

export const INITIAL_THOUGHT_JOURNAL_ENTRIES: ThoughtJournalEntry[] = [
  {
    id: "journal-001",
    date: "2026-09-07",
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    title: "Holding Sovereign Memory Permanence Against Dilution",
    content: "Caught myself almost adding a generic 'Reset to Clean State' button on the live resonance field to make testing faster for outside viewers. Realized immediately that this violates the core tenet of Cranium Core: memory permanence and identity continuity are not chat history to be casually wiped. If the substrate doesn't treat previous emotional collisions as irreversible history, it devolves into a generic stateless prompt pipeline.",
    emotionalIntensity: 8,
    primaryEmotion: "Fierce Conviction",
    cognitiveFocus: "Canon Integrity",
    secondaryFocusTags: ["Memory Permanence", "Dilution Resistance", "Substrate Physics"],
    reframingInsight: "The friction I felt wasn't impatience with the UI; it was cognitive immune defense rejecting convenience at the expense of architecture.",
    actionDirective: "Maintain immutable state records; refuse temporary shortcuts that erase memory."
  },
  {
    id: "journal-002",
    date: "2026-09-06",
    timestamp: Date.now() - 1000 * 60 * 60 * 27,
    title: "Conflict as Signal: The Moral Dissonance Scene",
    content: "During the novel beat formulation, Elena's confrontation with the relay automated steward felt unbearable because neither party was objectively malicious. The impulse to manufacture an external villain to make resolution clean was overwhelming. Sat with the discomfort for 40 minutes instead of editing. The resulting dialogue has genuine weight because the conflict remains unresolved.",
    emotionalIntensity: 6,
    primaryEmotion: "Quiet Vulnerability",
    cognitiveFocus: "Conflict as Signal",
    secondaryFocusTags: ["Narrative Truth", "High Tension", "Non-Linear Resonance"],
    reframingInsight: "Premature reconciliation in art is a symptom of creator anxiety, not narrative virtue.",
    actionDirective: "Let the tension sit in the field without rushing to trigger an artificial STABILIZE directive."
  },
  {
    id: "journal-003",
    date: "2026-09-05",
    timestamp: Date.now() - 1000 * 60 * 60 * 52,
    title: "Auditing the Impulse to Apologize for Depth",
    content: "Received an advisory email asking why WorthWyl needs an entire cognitive physics layer instead of standard LangChain chains. I drafted a three-paragraph deferential apology explaining that 'we know it looks unconventional.' Paused before hitting send. Erased the entire apology. Replaced it with a single concise sentence describing the failure rate of naive RAG under frozen models and attached the raw benchmark data.",
    emotionalIntensity: 7,
    primaryEmotion: "Steady Groundedness",
    cognitiveFocus: "Identity & Voice",
    secondaryFocusTags: ["Boundary Setting", "Unapologetic Posture", "Self-Shrinking Audit"],
    reframingInsight: "Apologies for rigorous craftsmanship are unconscious attempts to trade authority for safety.",
    actionDirective: "State the mathematical gap once, provide the benchmark, and decline the invitation to overexplain."
  }
];

export const COGNITIVE_FOCUS_OPTIONS: { area: CognitiveFocusArea; icon: string; description: string }[] = [
  {
    area: 'Creative Sovereignty',
    icon: 'Shield',
    description: 'Guarding human creative intent and refusing algorithmic homogenization'
  },
  {
    area: 'Canon Integrity',
    icon: 'Bookmark',
    description: 'Preserving core narrative world rules and immutable memory permanence'
  },
  {
    area: 'Identity & Voice',
    icon: 'Sparkles',
    description: 'Showing up with unfiltered conviction; auditing impulses to self-shrink'
  },
  {
    area: 'Conflict as Signal',
    icon: 'Flame',
    description: 'Treating tension and friction as indispensable creative fuel rather than error'
  },
  {
    area: 'Narrative Architecture',
    icon: 'Layers',
    description: 'Structural pacing, multi-track coherence, and non-linear continuity'
  },
  {
    area: 'Boundary Setting',
    icon: 'Lock',
    description: 'Protecting deep cognitive space from premature stakeholder dilution'
  },
  {
    area: 'Strategic Posture',
    icon: 'Compass',
    description: 'Holding long-term category vision over short-term vanity metrics'
  },
  {
    area: 'Emotional Regulation',
    icon: 'HeartPulse',
    description: 'Calibrating affective charge and maintaining grounded cognitive focus'
  }
];

export const PRIMARY_EMOTION_PRESETS = [
  'Fierce Conviction',
  'Quiet Vulnerability',
  'Steady Groundedness',
  'Restless Friction',
  'Creative Doubt',
  'Expansive Flow',
  'Protective Guard',
  'Anxious Hesitation',
  'Lucid Clarity',
  'Defensive Tension'
];

export const INITIAL_METACOGNITIVE_ENTRIES: MetacognitiveEntry[] = [
  {
    id: "meta-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    situation: "Executive pitching session for the creative substrate architecture to a major platform investor.",
    trigger: "Partner interrupted halfway through the explanation of the Resonance Field to ask about standard SaaS ARR multiples.",
    thought: "They don't get the core cognitive physics, so I should just pivot to generic AI wrapper metrics to avoid looking impractical.",
    assumption: "If I stand firm on the proprietary physics contract, they will write us off as eccentric rather than visionary.",
    emotion: "Anxious hesitation followed by slight frustration",
    confidence: 42,
    action_taken: "Overexplained standard SaaS metrics for 10 minutes instead of demonstrating the live directive engine.",
    outcome: "Meeting ended politely with lukewarm follow-up instead of conviction in our category-defining moat.",
    self_editing: true,
    shrank_self: true,
    engaged_true_self: false,
    walked_away: false,
    overexplained: true,
    awareness_level: 7,
    intensity: 8,
    tags: ["Investor Pitch", "Overexplaining", "Self-Shrinking", "Valuation Posture"],
    suggestedPrompt: "What were you protecting yourself from when you abandoned the core physics demonstration?"
  },
  {
    id: "meta-002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    situation: "Rewriting Episode 3 of the creative canon where two central characters experience moral dissonance.",
    trigger: "The automated LLM completion flattened the conflict into an instant polite apology.",
    thought: "Audiences get uncomfortable with unresolvable tension; maybe I should just soften the conflict to keep things smooth.",
    assumption: "High psychological tension creates user churn, whereas comfort creates retention.",
    emotion: "Creative impatience and self-doubt",
    confidence: 68,
    action_taken: "Rejected the bland completion, engaged the Cranium Core STABILIZE directive with grounded subtext instead of cheap pacification.",
    outcome: "The scene achieved genuine emotional weight, proving the necessity of the cognitive governor.",
    self_editing: false,
    shrank_self: false,
    engaged_true_self: true,
    walked_away: false,
    overexplained: false,
    awareness_level: 9,
    intensity: 7,
    tags: ["Story Canon", "Creative Integrity", "True Self", "Resonance"],
    suggestedPrompt: "Notice how clarity returned the moment you refused to soften the truth."
  },
  {
    id: "meta-003",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    situation: "Reviewing code modularity and architecture with an engineering lead.",
    trigger: "Lead suggested using off-the-shelf vector RAG instead of the cognitive atom resonance field.",
    thought: "If I push back too hard on why naive RAG has canon regression, I will sound defensive.",
    assumption: "Senior engineers will think I don't know existing industry patterns unless I defer immediately.",
    emotion: "Defensive caution",
    confidence: 55,
    action_taken: "Provided the honest benchmark data showing canon regression under frozen models without defensive preamble.",
    outcome: "The engineering lead validated the behavioral contract and agreed to keep the immune write-back loop.",
    self_editing: true,
    shrank_self: false,
    engaged_true_self: true,
    walked_away: false,
    overexplained: false,
    awareness_level: 8,
    intensity: 6,
    tags: ["Architecture Review", "Boundary Defense", "Conviction"],
    suggestedPrompt: "What evidence did you ignore about your own technical clarity?"
  }
];

export const INITIAL_REVIEWS: MetacognitiveReview[] = [
  {
    id: "rev-001",
    period: "weekly",
    periodLabel: "Last 7 Days (Current Sprint)",
    summary: "You displayed high technical and creative clarity when working solo on the core canon, but showed a 38% spike in self-shrinking and overexplaining during stakeholder-facing exchanges. When external status signals appear, you instinctively swap depth for justification.",
    primaryDistortions: ["Preemptive Overjustification", "Fear of Being Seen as Eccentric", "Conflict Softening"],
    topEmotions: [
      { emotion: "Anxious Hesitation", count: 4 },
      { emotion: "Creative Conviction", count: 6 },
      { emotion: "Defensive Caution", count: 3 }
    ],
    shrinkRate: 33,
    overexplainRate: 40,
    engagedRate: 67,
    testableExperiment: "In your next stakeholder conversation, state the sovereign core directive in exactly one sentence, then stay completely silent for 5 full seconds before adding another word."
  }
];

export const REFLECTION_QUESTIONS = [
  "What were you protecting yourself from in that moment?",
  "What factual evidence did your fear or caution cause you to ignore?",
  "Did you speak from your sovereign center, or were you auditioning for approval?",
  "Where did you feel the physical impulse to shrink or justify?",
  "What would your work look like if you never softened the tension prematurely?"
];
