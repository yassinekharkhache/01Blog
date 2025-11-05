import { Component, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-user-search',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-search.html',
  styleUrls: ['./user-search.css'],
})
export class UserSearch {
  searchQuery = signal('');
  users = signal<any[]>([]);
  loading = signal(false);
  allLoaded = false;
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  public baseApi = environment.apiUrl;
  lastquery = '';
  lastid: number;

  constructor() {
    this.lastid = 0;
    effect(() => {
      const query = this.searchQuery().trim();
      this.lastquery = query;
      this.users.set([]);
      this.lastid = 0;
      timer(400)
        .pipe(switchMap(() => this.http.get<any[]>(`${this.baseApi}/api/users/search/0?q=${query}`)))
        .subscribe({
          next: (data) => {
            if (data.length) {
              this.lastid = data[data.length - 1].Id;
              this.users.update(u => [...data]);
            } else {
              this.users.set([]);
            }
          },
          error: (err) => console.error('Search error:', err),
        });
    });
  }
  public loadusers(){
    
    this.http.get<any[]>(`${this.baseApi}/api/users/search/${this.lastid}?q=${this.lastquery}`).subscribe({
      next: (data) => {
        if (data.length) {
          this.lastid = data[data.length - 1].Id;
          this.users.update(u => [...u,...data]);
        } else {
          this.allLoaded = true;
        }
      },
      error: (err) => console.error('Search error:', err),
    });
  }

  async handleAction(event: Event, user: any) {
    const select = event.target as HTMLSelectElement;
    const action = select.value;
    if (!action) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to ${action}?` },
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) return;

    try {
      if (action === 'ban') {
        await this.http
          .post(`${this.baseApi}/api/users/ban`, { username: user.username })
          .toPromise();
      } else if (action === 'delete') {
        await this.http.delete(`${this.baseApi}/api/users/delete/${user.username}`).toPromise();
      }
    } catch (err) {
      console.error(`Failed to ${action} the user ${user.username}:`, err);
    } finally {
      select.value = '';
    }
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