import { Component, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-admin-search',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-search.html',
  styleUrls: ['./admin-search.css'],
})
export class AdminSearch {
  searchQuery = signal('');
  users = signal<any[]>([]);

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  public baseApi = environment.apiUrl;

  constructor() {
    // Effect automatically reacts to searchQuery changes
    effect(() => {
      const query = this.searchQuery().trim();

      if (!query) {
        this.users.set([]);
        return;
      }

      // Debounce manually using timer + switchMap
      timer(400)
        .pipe(switchMap(() => this.http.get<any[]>(`${this.baseApi}/api/users/search?q=${query}`)))
        .subscribe({
          next: (data) => this.users.set(data),
          error: (err) => console.error('Search error:', err),
        });
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
        console.log(`User ${user.username} banned successfully`);
      } else if (action === 'delete') {
        await this.http.delete(`${this.baseApi}/api/users/delete/${user.username}`).toPromise();
        console.log(`User ${user.username} deleted successfully`);
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
}
