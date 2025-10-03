import { Routes } from '@angular/router';
// import {BlogEditorComponent} from './post-editor'

export const routes: Routes = [
    {
        path:'new-post',
        pathMatch: 'full',
        loadComponent(){
            return import('./post-editor/post-editor').then(m => m.BlogEditorComponent);
        }
    }
];
