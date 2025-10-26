// import { Component, signal, effect, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environment/environment';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
// import { of, timer } from 'rxjs';
// import { environment } from '../../../environment/environment';
// import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';

// @Component({
//   imports: [RouterModule],
//   selector: 'app-admin-search',
//   templateUrl: './admin-search.html',
//   styleUrls: ['./admin-search.css'],
// })
// export class AdminSearch {
//   searchQuery = signal('');
//   users = signal<any[]>([]);
//   loading = signal(false);
//   private lastId: number | null = null;
//   private allLoaded = false;
//   private http = inject(HttpClient);
//   public baseApi = environment.apiUrl;


//   public search(query: string) {
//     console.log("132")
//     if (this.loading() || this.allLoaded) return;

//     this.loading.set(true);

//     const url = this.lastId !== null
//       ? `${this.baseApi}/api/users/search/${this.lastId}?q=${query}`
//       : `${this.baseApi}/api/users/search/0?q=${query}`;

//     this.http.get<any[]>(url).subscribe({
//       next: (data) => {
//         if (data.length) {
//           this.lastId = data[data.length - 1].id;
//           this.users.update(u => [...u, ...data]);
//         } else {
//           this.allLoaded = true;
//         }
//         this.loading.set(false);
//       },
//       error: () => this.loading.set(false),
//     });
//   }
//   public handleAction(action: any, user: any) {

//   }

//   handleScroll(event: Event) {
//     const target = event.target as HTMLElement;
//     const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

//     if (atBottom && !this.loading() && !this.allLoaded) {
//       this.search(this.searchQuery().trim());
//     }
//   }

//   trackById(index: number, user: any) {
//     return user.id;
//   }
// }

import { Component, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, switchMap, distinctUntilChanged, last } from 'rxjs/operators';
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
      if (query == this.lastquery) {
        return;
      }
      this.lastquery = query;
      this.lastid = 0;
      this.users.set([]);
      timer(400)
        .pipe(switchMap(() => this.http.get<any[]>(`${this.baseApi}/api/users/search/0?q=${query}`)))
        .subscribe({
          next: (data) => {
            if (data.length) {
              this.lastid = data[data.length - 1].id;
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
          this.lastid = data[data.length - 1].id;
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