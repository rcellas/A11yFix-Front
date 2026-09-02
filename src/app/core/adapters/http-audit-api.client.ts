import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditReport, Finding, FindingRemediation } from '../models';
import {
  ApplyRemediationRequest,
  AuditApiClient,
  ProposeRemediationRequest,
  ScanRequest,
  VerificationResult,
  VerifyFindingRequest
} from '../ports/audit-api.port';
import { API_CONFIG } from '../tokens/api-config.token';

@Injectable({
  providedIn: 'root'
})
export class HttpAuditApiClient implements AuditApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  private get baseUrl(): string {
    return this.config.baseUrl;
  }

  startScan(request: ScanRequest): Observable<AuditReport> {
    return this.http.post<AuditReport>(`${this.baseUrl}/audits`, request);
  }

  getAudit(auditId: string): Observable<AuditReport> {
    return this.http.get<AuditReport>(`${this.baseUrl}/audits/${auditId}`);
  }

  getFinding(auditId: string, findingId: string): Observable<Finding> {
    return this.http.get<Finding>(`${this.baseUrl}/audits/${auditId}/findings/${findingId}`);
  }

  proposeRemediation(request: ProposeRemediationRequest): Observable<FindingRemediation> {
    return this.http.post<FindingRemediation>(
      `${this.baseUrl}/audits/${request.auditId}/findings/${request.findingId}/propose-remediation`,
      {}
    );
  }

  applyRemediation(
    request: ApplyRemediationRequest
  ): Observable<{ success: boolean; appliedAt: string }> {
    return this.http.post<{ success: boolean; appliedAt: string }>(
      `${this.baseUrl}/audits/${request.auditId}/findings/${request.findingId}/apply-remediation`,
      {
        remediation: request.approvedRemediation,
        approvedBy: request.approvedBy
      }
    );
  }

  verifyFinding(request: VerifyFindingRequest): Observable<VerificationResult> {
    return this.http.post<VerificationResult>(
      `${this.baseUrl}/audits/${request.auditId}/findings/${request.findingId}/verify`,
      {}
    );
  }
}
