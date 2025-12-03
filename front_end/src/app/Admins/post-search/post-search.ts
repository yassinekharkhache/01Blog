import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, effect } from '@angular/core';
import { environment } from '../../../environment/environment';
import { switchMap, timer } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-search',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './post-search.html',
  styleUrl: './post-search.css'
})
export class PostSearch {
  searchQuery = signal('');
  posts = signal<any[]>([]);
  loading = signal(false);
  allLoaded = false;
  private http = inject(HttpClient);
  public baseApi = environment.apiUrl;
  lastquery = '';
  lastid = 0;
  dialog = inject(MatDialog);


  constructor() {
    effect(() => {
      const query = this.searchQuery().trim();
      this.lastquery = query;
      this.posts.set([]);
      this.lastid = 0;
      timer(400)
        .pipe(switchMap(() => this.http.get<any[]>(`${this.baseApi}/api/post/search/0?q=${query}`)))
        .subscribe({
          next: (data) => {
            if (data.length) {
              this.lastid = data[data.length - 1].id;
              this.posts.update(u => [...data]);
            } else {
              this.posts.set([]);
            }
          },
        });
    });
  }
  public loadusers() {
    if (this.loading() || this.allLoaded) return;
    this.loading.set(true);
    console.log(this.lastid)
    this.http.get<any[]>(`${this.baseApi}/api/post/search/${this.lastid}?q=${this.lastquery}`).subscribe({
      next: (data) => {
        if (data.length) {
          this.lastid = data[data.length - 1].id;
          this.posts.update(u => [...u, ...data]);
          this.loading.set(false);
        } else {
          this.loading.set(false);
          this.allLoaded = true;
        }
      },
    });
  }

  handleAction(event: Event, post: any) {
    const select = event.target as HTMLSelectElement;
    const action = select.value;
    if (!action) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to ${action} this post?` },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        select.value = '';
        return;
      }

      let request$;
      if (action === 'hide') {
        request$ = this.http.post(`${this.baseApi}/api/post/hide`, {PostId: post.id})
      } else if (action === 'delete') {
        request$ = this.http.delete(`${this.baseApi}/api/post/delete/${post.id}`);
      }

      if (request$) {
        request$.subscribe({
          next: () => {
            if (action === 'delete'){
              this.posts.update(u => u.filter(p => p.id !== post.id));
            }
          },
          error: (err) => {
            select.value = '';
          }
        });
      }
    });
  }

  trackById(index: number, user: any) {
    return user.id;
  }

  handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (atBottom || !this.allLoaded && !this.loading) {
      this.loadusers();
    }
  }

}
