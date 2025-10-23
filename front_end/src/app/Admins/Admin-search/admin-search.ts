import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';
@Component({
  selector: 'app-admin-search',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './admin-search.html',
  styleUrls: ['./admin-search.css'],
})
export class AdminSearch implements OnInit, OnDestroy {
  public baseurl = environment.apiUrl;
  searchQuery = '';
  users: any[] = [];

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;
  private baseApi = environment.apiUrl;

  ngOnInit() {
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) =>
          this.http.get<any[]>(`${this.baseurl}/api/users/search?q=${query}`)
        )
      )
      .subscribe({
        next: (data) => { this.users = data },
        error: (err) => console.error('Search error:', err),
      });
  }

  searchUsers() {
    const query = this.searchQuery.trim();
    if (!query) {
      this.users = [];
      return;
    }
    this.searchSubject.next(query);
  }

  handleAction(event: Event, user: any) {
    const select = event.target as HTMLSelectElement;
    const action = select.value;

    if (!action) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { message: `Are you sure you want to ${action}?` },
        });
    
        const confirmed = dialogRef.afterClosed();

    if (action === 'ban') {
      this.http.post(this.baseApi + '/api/users/ban', { username: user.username }).subscribe({
        next: () => console.log(`user ${user.username} banned successfully`),
        error: (err) => console.error(`Failed to ban the user ${user.username} err: ${err}`),
      });
    }

    if (action === 'delete') {
      this.http.delete(this.baseApi + '/api/users/delete/' + user.username).subscribe({
        next: () => console.log(`user ${user.username} deleted successfully`),
        error: (err) => console.error(`Failed to delete the user ${user.username} err: ${err}`),
      });
    }

    select.value = '';
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
