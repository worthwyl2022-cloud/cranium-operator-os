import { CognitiveAtom, Directive, Metrics } from '../../types/creativeOs';
import { ResonanceField } from './field';
import { CALIBRATED_THRESHOLDS } from './directives';

export { CALIBRATED_THRESHOLDS };

export interface TickRecord {
  cycle: number;
  atom_id: string;
  atom_label?: string;
  metrics: Metrics;
  directives: Directive[];
  timestamp: number;
}

export function resolve(
  metrics: Metrics,
  thresholds: typeof CALIBRATED_THRESHOLDS = CALIBRATED_THRESHOLDS
): Directive[] {
  const directives: Directive[] = [];

  // Priority order: STABILIZE > ESCALATE > SHIFT_THEME > ADVANCE
  if (metrics.coherence < thresholds.coherence_floor || metrics.continuity < thresholds.continuity_floor) {
    directives.push(Directive.STABILIZE);
  }
  if (metrics.tension < thresholds.tension_floor) {
    directives.push(Directive.ESCALATE);
  }
  if (metrics.theme_drift > thresholds.theme_drift_ceiling) {
    directives.push(Directive.SHIFT_THEME);
  }

  if (directives.length === 0) {
    directives.push(Directive.ADVANCE);
  }

  return directives;
}

export class CraniumLoop {
  field: ResonanceField;
  thresholds: typeof CALIBRATED_THRESHOLDS;
  cycle: number = 0;
  log: TickRecord[] = [];

  constructor(initialField?: ResonanceField, thresholds = CALIBRATED_THRESHOLDS) {
    this.field = initialField || new ResonanceField();
    this.thresholds = thresholds;
  }

  tick(atom: CognitiveAtom): TickRecord {
    this.cycle += 1;
    this.field.inject(atom);
    const metrics = this.field.metrics();
    const directives = resolve(metrics, this.thresholds);

    const record: TickRecord = {
      cycle: this.cycle,
      atom_id: atom.id,
      atom_label: atom.label || atom.id,
      metrics,
      directives,
      timestamp: Date.now(),
    };

    this.log.push(record);
    return record;
  }

  latestRecord(): TickRecord | undefined {
    return this.log[this.log.length - 1];
  }
}
