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

    // If route requires role but user is not logged in → redirect
    if (!user) {
      this.router.navigate(['/explore']);
      return false;
    }

    // If route requires a specific role and user doesn't have it → redirect
    if (requiredRole && user.role !== requiredRole) {
      this.router.navigate(['/explore']);
      return false;
    }

    return true; // allowed
  }
}