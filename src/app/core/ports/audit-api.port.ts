import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditReport, Finding, FindingRemediation } from '../models';

export interface ScanRequest {
  readonly url: string;
}

export interface ProposeRemediationRequest {
  readonly auditId: string;
  readonly findingId: string;
}

export interface ApplyRemediationRequest {
  readonly auditId: string;
  readonly findingId: string;
  readonly approvedRemediation: FindingRemediation;
  readonly approvedBy: string;
}

export interface VerifyFindingRequest {
  readonly auditId: string;
  readonly findingId: string;
}

export interface VerificationResult {
  readonly findingId: string;
  readonly passed: boolean;
  readonly details: string;
}

/**
 * Port contract for external Audit & Remediation API
 */
export interface AuditApiClient {
  startScan(request: ScanRequest): Observable<AuditReport>;
  getAudit(auditId: string): Observable<AuditReport>;
  getFinding(auditId: string, findingId: string): Observable<Finding>;
  proposeRemediation(request: ProposeRemediationRequest): Observable<FindingRemediation>;
  applyRemediation(request: ApplyRemediationRequest): Observable<{ success: boolean; appliedAt: string }>;
  verifyFinding(request: VerifyFindingRequest): Observable<VerificationResult>;
  generateRegressionTest(findingId: string): Observable<{ code: string }>;
}

export const AUDIT_API_CLIENT = new InjectionToken<AuditApiClient>('AUDIT_API_CLIENT');
