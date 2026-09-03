import { PatternType } from '../../models';

export interface BackendAuditDto {
  readonly id: string;
  readonly url?: string;
  readonly targetUrl?: string;
  readonly status?: string;
  readonly findingsCount?: number;
  readonly createdAt?: string;
  readonly timestamp?: string;
  readonly findings?: readonly unknown[];
  readonly summary?: unknown;
}

export interface BackendTargetSelectorDto {
  readonly cssSelector?: string;
  readonly role?: string;
}

export interface BackendFindingDto {
  readonly id: string;
  readonly auditId?: string;
  readonly patternType?: string;
  readonly ruleId?: string;
  readonly severity?: string;
  readonly message?: string;
  readonly helpUrl?: string;
  readonly targetSelector?: BackendTargetSelectorDto | string;
  readonly selector?: string;
  readonly htmlSnippet?: string;
  readonly createdAt?: string;
  readonly wcagCriterionId?: string;
  readonly wcagId?: string;
  readonly criterion?: string;
}

export interface BackendRemediationProposalDto {
  readonly title: string;
  readonly description: string;
  readonly suggestedDiff?: string;
  readonly suggestedAttributes?: Record<string, string>;
  readonly suggestedPattern?: PatternType;
}

export interface BackendRemediationDto {
  readonly id: string;
  readonly findingId: string;
  readonly status: string;
  readonly proposal: BackendRemediationProposalDto;
  readonly createdAt?: string;
}
