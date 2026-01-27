import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';


interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {
  userRole: string = '';
  userName: string = '';
  userInitials: string = '';
  menuItems: MenuItem[] = [];
 

  private readonly menuConfig: { [key: string]: MenuItem[] } = {
    customer: [
      { label: 'Dashboard', route: 'dashboard', icon: 'grid_view' },
      { label: 'Browse Policies', route: 'policies', icon: 'shopping_cart' },
      { label: 'My Policies', route: 'my-policies', icon: 'description' },
      { label: 'Claims', route: 'claims', icon: 'assignment_turned_in' },
      { label: 'Documents', route: 'documents', icon: 'folder_open' },
      { label: 'Profile', route: 'profile', icon: 'person' }
    ],
    agent: [
      { label: 'Dashboard', route: 'dashboard', icon: 'grid_view' },
      { label: 'Assigned Customers', route: 'customers', icon: 'people' },
      { label: 'Policies', route: 'policies', icon: 'shopping_cart' },
      { label: 'Claims', route: 'claims', icon: 'assignment' },
      { label: 'Commissions', route: 'commissions', icon: 'monetization_on' },
      { label: 'Profile', route: 'profile', icon: 'person' }
    ],
    admin: [
            { label: 'System Overview', route: 'system-overview', icon: 'dashboard_customize' },
      { label: 'Agent Management', route: 'agent-management', icon: 'people' },
      { label: 'Policy Management', route: 'policy-management', icon: 'shopping_cart' },
      { label: 'Claims Review', route: 'claims-review', icon: 'assignment_turned_in' },
      { label: 'Reports', route: 'reports', icon: 'assessment' }
    ]
  };

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.auth.getRole();
    const user = this.auth.getUser();

    console.log(this.userRole);

    if (!this.userRole || !user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = user.username || 'User';
    this.userInitials = this.getInitials(this.userName);
    this.menuItems = this.menuConfig[this.userRole] || [];
  }

    get roleColor():string{
    switch(this.userRole){
      case 'admin':return 'bg-slate-900';
      case 'agent':return 'bg-green-900';
      case 'client':return 'bg-yellow-200';
      default:return 'bg-gray-200';
    }
  }
   
 get routeColor():string{
    switch(this.userRole){
      case 'admin':return 'bg-slate-500';
      case 'agent':return 'bg-green-200';
      case 'client':return 'bg-yellow-200';
      default:return 'bg-gray-200';
    }
  }


  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getRoleDisplayName(): string {
    return this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1);
  }
}
