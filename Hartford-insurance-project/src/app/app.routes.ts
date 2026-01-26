import { Routes } from '@angular/router';
import { Landing } from '../components/landing/landing';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { Customer } from '../components/customer/customer';
import { Agent } from '../components/agent/agent';
import { Admin } from '../components/admin/admin';
import { CustomerDashboard } from '../components/customer-dashboard/customer-dashboard';
import { CustomerProfile } from '../components/customer-profile/customer-profile';
import { BrowsePolicies } from '../components/browse-policies/browse-policies';
import { MyPolicies } from '../components/my-policies/my-policies';
import { FileClaim } from '../components/file-claim/file-claim';
import { TrackClaims } from '../components/track-claims/track-claims';
import { Documents } from '../components/documents/documents';
import { DashboardLayout } from '../components/layout/dashboard-layout/dashboard-layout';
import { Claims } from '../components/claims/claims';
export const routes: Routes = [
    {path:'',component:Landing},
    {path:'login',component:Login},
    {path:'register',component:Register},
    {
  path: 'customer',
  component: DashboardLayout,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: CustomerDashboard },
    { path: 'profile', component: CustomerProfile },
    { path: 'policies', component: BrowsePolicies },
    { path: 'my-policies', component: MyPolicies },
    { path: 'claims', component: Claims },
    { path: 'file-claim', component: FileClaim },
    { path: 'documents', component: Documents },
    {path:'customer-profile',component:CustomerProfile}
  ]
}
,
    {path:'agent',component:Agent},
    {path:'admin',component:Admin},
    
];
