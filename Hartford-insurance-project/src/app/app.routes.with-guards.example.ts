// OPTIONAL: Enhanced app.routes.ts with RoleGuard for additional security
// This file shows how to protect routes with role-based access control guards
// To use this, import RoleGuard and add canActivate to your routes

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
import { RoleGuard } from '../auth/guards/role.guard';

export const routesWithGuards: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    // Customer Dashboard - Protected by RoleGuard
    {
        path: 'customer',
        component: DashboardLayout,
        canActivate: [RoleGuard],
        data: { role: 'customer' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CustomerDashboard },
            { path: 'profile', component: CustomerProfile },
            { path: 'policies', component: BrowsePolicies },
            { path: 'claims', component: Claims },
            { path: 'file-claim', component: FileClaim },
            { path: 'documents', component: Documents },
            { path: 'customer-profile', component: CustomerProfile }
        ]
    },
    
    // Agent Dashboard - Protected by RoleGuard
    {
        path: 'agent',
        component: DashboardLayout,
        canActivate: [RoleGuard],
        data: { role: 'agent' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CustomerDashboard },
            { path: 'profile', component: CustomerProfile },
            { path: 'customers', component: BrowsePolicies },
            { path: 'claims', component: Claims },
            { path: 'commissions', component: Documents }
        ]
    },
    
    // Admin Dashboard - Protected by RoleGuard
    {
        path: 'admin',
        component: DashboardLayout,
        canActivate: [RoleGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CustomerDashboard },
            { path: 'profile', component: CustomerProfile },
            { path: 'agent-management', component: BrowsePolicies },
            { path: 'policy-management', component: Claims },
            { path: 'claims-review', component: Documents },
            { path: 'system-overview', component: CustomerDashboard },
        ]
    }
];
