import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { CustomerDashboard } from './components/customer-dashboard/customer-dashboard';
import { CustomerProfile } from './components/customer-profile/customer-profile';
import { BrowsePolicies } from './components/browse-policies/browse-policies';
import { FileClaim } from './components/file-claim/file-claim';
import { TrackClaims } from './components/track-claims/track-claims';
import { Documents } from './components/documents/documents';
import { DashboardLayout } from './components/layout/dashboard-layout/dashboard-layout';
import { Claims } from './components/claims/claims';
import { Admin } from './components/admin/admin';
import { PolicyManagement } from '../features/policy-management/policy-management';
import { SystemOverview } from '../features/system-overview/system-overview';
import { AgentManagement } from '../features/agent-management/agent-management';
import { ClaimReview } from '../features/claim-review/claim-review';
import { AgentProfile } from './components/agent-profile/agent-profile';
import { AgentDashboard } from './components/agent/agent-dashboard/agent-dashboard';
import { AssignedCustomers } from './components/agent/assigned-customers/assigned-customers';
import { AgentCustomerProfile } from './components/agent/agent-customer-profile/agent-customer-profile';
import { AgentManageClaims } from './components/agent-manage-claims/agent-manage-claims';
import { CommunicationLog } from './components/agent/communication-log/communication-log';
import { Commissions } from './components/agent/commissions/commissions';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    // Customer Dashboard
    {
        path: 'customer',
        component: DashboardLayout,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CustomerDashboard },
            { path: 'profile', component: CustomerProfile },
            { path: 'policies', component: PolicyManagement },
            { path: 'claims', component: Claims },
            { path: 'file-claim', component: FileClaim },
            { path: 'documents', component: Documents },
            { path: 'customer-profile', component: CustomerProfile }
        ]
    },
    
    // Agent Dashboard
    {
        path: 'agent',
        component: DashboardLayout,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AgentDashboard },
            { path: 'agent-profile', component: AgentProfile }, // Reusing generic profile
            { path: 'customers', component: AssignedCustomers },
            { path: 'customer/:id', component: AgentCustomerProfile },
            { path: 'policies', component: BrowsePolicies }, // Agent view policies
            { path: 'claims', component: AgentManageClaims },
            { path: 'communication', component: CommunicationLog },
            { path: 'commissions', component: Commissions }
        ]
    },
    
    // Admin Dashboard
    {
        path: 'admin',
        component: DashboardLayout,
        children: [
            { path: '', redirectTo: 'system-overview', pathMatch: 'full' },
            { path: 'system-overview', component:SystemOverview }, 
           
            { path: 'profile', component: CustomerProfile }, // Placeholder - replace with AdminProfile
            { path: 'agent-management', component: AgentManagement}, // Placeholder
            { path: 'policy-management', component: PolicyManagement }, // Placeholder
            { path: 'claims-review', component: ClaimReview }, // Placeholder
            // Placeholder
        ]
    }
];

