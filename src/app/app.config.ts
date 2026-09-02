import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MockAuditApiClient } from './core/adapters/mock-audit-api.client';
import { AUDIT_API_CLIENT } from './core/ports/audit-api.port';
import { provideWebMcpTools } from './core/webmcp';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: AUDIT_API_CLIENT,
      useClass: MockAuditApiClient
    },
    ...provideWebMcpTools()
  ]
};
