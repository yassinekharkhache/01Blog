import { Injectable, signal, effect, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { environment } from '../../../environment/environment';
import { Observable, switchMap, of } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  seen: boolean;
  sender: any;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})

export class NotificationService {
  private http = inject(HttpClient);
  public userService = inject(UserService);

  private notificationsSignal = signal<Notification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();



  private lastId: number | null = null;
  private isLoading = false;

  public unseenCount = signal(0);

  constructor() {
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.loadNotifications(user.username);
        this.loadUnseenCount();
      } else {
        this.notificationsSignal.set([]);
        this.unseenCount.set(0);
      }
    });
  }

  public loadUnseenCount() {
    const user = this.userService.user();
    if (!user) return;
    this.http
      .get<{ count: number }>(`${environment.apiUrl}/api/notifications/count`)
      .subscribe(res => {this.unseenCount.set(res.count)});
  }

  loadNotifications(username: string, lastId?: number) {
    if (this.isLoading) return;
    this.isLoading = true;

    const url = lastId
      ? `${environment.apiUrl}/api/notifications/${username}/${lastId}`
      : `${environment.apiUrl}/api/notifications/${username}/0`;

    this.http.get<Notification[]>(url).subscribe({
      next: (data) => {
        if (lastId) {
          this.notificationsSignal.update(prev => [...prev, ...data]);
        } else {
          this.notificationsSignal.set(data);
        }

        if (data.length > 0)
          this.lastId = data[data.length - 1].id;

        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  loadMore(username: string) {
    if (this.lastId) this.loadNotifications(username, this.lastId);
  }

  markAllAsSeen(username: string) {
    this.unseenCount.set(0)
    this.http.post<void>(`${environment.apiUrl}/api/notifications/seen/${username}`, {})
      .subscribe((data) => {
        const updated = this.notificationsSignal().map(n => ({ ...n, seen: true }));
        this.notificationsSignal.set(updated);
      });
  }
}
