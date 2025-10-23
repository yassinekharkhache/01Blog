import { Routes } from '@angular/router';
import { RoleGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '', // USER and ADMIN
    pathMatch: 'full',
    loadComponent: () => import('./following/following').then(m => m.Following),
    canActivate: [RoleGuard],
    data: { role: 'USER' }
  },
  {
    path: 'new-post', // USER and ADMIN
    pathMatch: 'full',
    loadComponent: () => import('./post-editor/post-editor').then(m => m.BlogEditorComponent),
    canActivate: [RoleGuard],
    data: { role: 'USER' }
  },
  {
    path: 'profile/:username', // public
    pathMatch: 'full',
    loadComponent: () => import('./profile/profile').then(m => m.Profile)
  },
  {
    path: 'post/:id', // public
    pathMatch: 'full',
    loadComponent: () => import('./post-details/post-details').then(m => m.PostDetails)
  },
  {
    path: 'explore', // public
    pathMatch: 'full',
    loadComponent: () => import('./explore/explore').then(m => m.Explore)
  },
  {
    path: 'post/edit/:id', // USER and ADMIN
    pathMatch: 'full',
    loadComponent: () => import('./edit/edit').then(m => m.Edit),
    canActivate: [RoleGuard],
    data: { role: 'USER'}
  },
  {
    path: 'admins', // ADMIN only
    pathMatch: 'full',
    loadComponent: () => import('./Admins/admin-panel/admin-panel').then(m => m.AdminPannel),
    canActivate: [RoleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./notfound/notfound').then(m => m.Notfound)

  }
];
