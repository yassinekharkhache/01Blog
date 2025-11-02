import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, effect, OnInit} from '@angular/core';
import { environment } from '../../../environment/environment';
import { switchMap, timer } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { consumerMarkDirty } from '@angular/core/primitives/signals';
// import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-post-search',
  imports: [FormsModule, CommonModule,RouterModule],
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
  lastid: number;

  constructor() {
    this.lastid = 0;
    effect(() => {
      const query = this.searchQuery().trim();
      this.lastquery = query;
      this.posts.set([]);
      this.lastid = 0;
      timer(400)
        .pipe(switchMap(() => this.http.get<any[]>(`${this.baseApi}/api/post/search/0?q=${query}`)))
        .subscribe({
          next: (data) => {
            console.log(data)
            if (data.length) {
              this.lastid = data[data.length - 1].id;
              this.posts.update(u => [...data]);
            } else {
              this.posts.set([]);
            }
          },
          error: (err) => console.error('Search error:', err),
        });
    });
  }
  public loadusers(){
    this.http.get<any[]>(`${this.baseApi}/api/post/search/${this.lastid}?q=${this.lastquery}`).subscribe({
      next: (data) => {
        if (data.length) {
          this.lastid = data[data.length - 1].Id;
          this.posts.update(u => [...u,...data]);
        } else {
          this.allLoaded = true;
        }
      },
      error: (err) => console.error('Search error:', err),
    });
  }

  async handleAction(event: Event, post: any) {
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
