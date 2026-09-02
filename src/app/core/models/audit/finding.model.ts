import { PatternType } from '../pattern/pattern-type.model';
import { WcagCriterion } from '../wcag/wcag-criterion.model';
import { FindingSeverity } from './severity.model';

export interface FindingRemediation {
  readonly originalHtml: string;
  readonly proposedHtml: string;
  readonly explanation: string;
  readonly apgPattern?: PatternType;
}

export interface Finding {
  readonly id: string;
  readonly ruleId: string;
  readonly wcagCriterionId: string;
  readonly wcagCriterion?: WcagCriterion;
  readonly selector: string;
  readonly htmlSnippet: string;
  readonly message: string;
  readonly severity: FindingSeverity;
  readonly patternType?: PatternType;
  readonly remediation?: FindingRemediation;
}
