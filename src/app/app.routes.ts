import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/audit-page/audit-page.component').then(
        m => m.AuditPageComponent
      ),
    pathMatch: 'full',
    title: 'Audit Workspace — A11yFix'
  },
  {
    path: 'how-it-works',
    loadComponent: () =>
      import('./features/how-it-works/how-it-works.component').then(
        m => m.HowItWorksComponent
      ),
    title: 'How It Works — A11yFix'
  }
];
