import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: 'new-post',
        pathMatch: 'full',
        loadComponent() {
            return import('./post-editor/post-editor').then(m => m.BlogEditorComponent);
        }
    },
    {
        path: 'profile/:username',
        pathMatch: 'full',
        loadComponent() {
            return import('./profile/profile').then(m => m.Profile);
        }
    },
    {
        path: 'post/:id',
        pathMatch: 'full',
        loadComponent() {
            return import('./post-details/post-details').then(m => m.PostDetails);
        }
    },
    {
        path: '',
        pathMatch: 'full',
        loadComponent() {
            return import('./explore/explore').then(m => m.Explore);
        }
    },
    {
        path: 'post/edit/:id',
        pathMatch: 'full',
        loadComponent() {
            return import('./edit/edit').then(m => m.Edit);
        }
    },
    {
        path: 'admins',
        pathMatch:'full',
        loadComponent(){
            return import('./Admins/admin-panel/admin-panel').then(m=>m.AdminPannel);
        }
    }
];
