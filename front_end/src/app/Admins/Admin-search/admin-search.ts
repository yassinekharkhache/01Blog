import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-search',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './admin-search.html',
  styleUrls: ['./admin-search.css'],
})
export class AdminSearch implements OnInit, OnDestroy {
  public baseurl = environment.apiUrl;
  searchQuery = '';
  users: any[] = [];
  private http = inject(HttpClient);
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

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
        next: (data) => {this.users = data},
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

  if (action === 'ban') {
    if (!confirm(`Are you sure you want to ban ${user.username}?`)) return;
    this.http.post(`${this.baseurl}/api/admin/ban/${user.id}`, {}).subscribe({
      next: () => alert(`${user.username} has been banned.`),
      error: (err) => console.error('Ban failed:', err),
    });
  }

  if (action === 'delete') {
    if (!confirm(`Delete ${user.username}? This cannot be undone.`)) return;
    this.http.delete(`${this.baseurl}/api/admin/delete/${user.id}`).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        alert(`${user.username} has been deleted.`);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }

  select.value = ''; // reset menu
}

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
