import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['role'] as string;
    const userRole = this.auth.getRole();

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      switch (userRole) {
        case 'customer':
          this.router.navigate(['/customer']);
          break;
        case 'agent':
          this.router.navigate(['/agent']);
          break;
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }
}
