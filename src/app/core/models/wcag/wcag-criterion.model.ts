import { WcagLevel, WcagPrinciple } from './wcag-level.model';

export interface WcagCriterion {
  readonly id: string;            // e.g. '1.4.3'
  readonly name: string;          // e.g. 'Contrast (Minimum)'
  readonly principle: WcagPrinciple;
  readonly level: WcagLevel;
  readonly description: string;
  readonly url: string;
}
