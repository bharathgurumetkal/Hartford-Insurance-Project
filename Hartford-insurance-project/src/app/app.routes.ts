import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [

  {
    path: 'admin',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/system-overview/system-overview')
            .then(m => m.SystemOverview)
      },

      {
        path: 'policies',
        loadComponent: () =>
          import('../features/policy-management/policy-management')
            .then(m => m.PolicyManagement)
      },

      {
        path: 'agents',
        loadComponent: () =>
          import('../features/agent-management/agent-management')
            .then(m => m.AgentManagement)
      },

      {
        path: 'claims',
        loadComponent: () =>
          import('../features/claim-monitoring/claim-monitoring')
            .then(m => m.ClaimMonitoring)
      },

    //   {
    //     path: 'revenue',
    //     loadComponent: () =>
    //       import('./features/revenue-reports/revenue-reports.component')
    //         .then(m => m.RevenueReportsComponent)
    //   },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: 'agent',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/dashboard/Dashboards/agent/agent')
            .then(m => m.Agent)
      },
       {
        path: 'policies',
        loadComponent: () =>
          import('../features/assign-policies/assign-policies')
            .then(m => m.AssignPolicies)
      },
       {
        path: 'claims',
        loadComponent: () =>
          import('../features/claim-review/claim-review')
            .then(m => m.ClaimReview)
      },

    ]
  },

  {
    path: 'client',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/dashboard/Dashboards/client/client')
            .then(m => m.Client)
      }
    ]
  },

  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  }

];
