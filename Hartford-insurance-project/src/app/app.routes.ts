import { Routes } from '@angular/router';
import { Landing } from '../components/landing/landing';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { CustomerDashboard } from '../components/customer-dashboard/customer-dashboard';
import { CustomerProfile } from '../components/customer-profile/customer-profile';
import { BrowsePolicies } from '../components/browse-policies/browse-policies';
import { MyPolicies } from '../components/my-policies/my-policies';
import { FileClaim } from '../components/file-claim/file-claim';
import { TrackClaims } from '../components/track-claims/track-claims';
import { Documents } from '../components/documents/documents';
import { DashboardLayout } from '../components/layout/dashboard-layout/dashboard-layout';
import { Claims } from '../components/claims/claims';
import { Admin } from '../components/admin/admin';
import { PolicyManagement } from '../features/policy-management/policy-management';
import { SystemOverview } from '../components/system-overview/system-overview';
import { AgentManagement } from '../features/agent-management/agent-management';
import { ClaimReview } from '../features/claim-review/claim-review';

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
            { path: 'my-policies', component: MyPolicies },
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
            { path: 'dashboard', component: CustomerDashboard }, // Placeholder - replace with AgentDashboard
            { path: 'profile', component: CustomerProfile }, // Placeholder - replace with AgentProfile
            { path: 'customers', component: BrowsePolicies }, // Placeholder
            { path: 'policies', component: MyPolicies }, // Placeholder
            { path: 'claims', component: Claims }, // Placeholder
            { path: 'commissions', component: Documents } // Placeholder
        ]
    },
    
    // Admin Dashboard
    {
        path: 'admin',
        component: DashboardLayout,
        children: [
            { path: '', redirectTo: 'admin', pathMatch: 'full' },
            { path: 'system-overview', component:SystemOverview }, 
           
            { path: 'profile', component: CustomerProfile }, // Placeholder - replace with AdminProfile
            { path: 'agent-management', component: AgentManagement}, // Placeholder
            { path: 'customer-management', component: MyPolicies }, // Placeholder
            { path: 'policy-management', component: PolicyManagement }, // Placeholder
            { path: 'claims-review', component: ClaimReview }, // Placeholder
            // Placeholder
            { path: 'reports', component: MyPolicies } // Placeholder
        ]
    }
];

