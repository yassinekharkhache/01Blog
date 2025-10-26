import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    const user = this.userService.user();
    const requiredRole = route.data?.['role'];

    if (!user) {
      this.router.navigate(['/explore']);
      return false;
    }

    // Admin can access everything
    if (user.role === 'ADMIN') {
      return true;
    }

    // Regular user can only access USER routes
    if (requiredRole && user.role !== requiredRole) {
      this.router.navigate(['/explore']);
      return false;
    }

    return true;
  }
}