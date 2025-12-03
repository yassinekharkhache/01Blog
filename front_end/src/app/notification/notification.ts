import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../services/notification/notification.service';
import { UserService } from '../services/user/user.service';
import { RouterLink } from "@angular/router";
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, RouterLink],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css'],
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);

  notifications = this.notificationService.notifications;
  showNotifications = false;
  unseenCount = this.notificationService.unseenCount;

  public BaseApi = environment.apiUrl;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  trackByNotificationId(index: number, notification: any): number {
    return notification.id;
  }

  markAllAsSeen() {
    const user = this.userService.user();
    if (!user) return;
    this.notificationService.markAllAsSeen(user.username);
  }

  markAsSeen(id: number, seen: boolean) {
    if (seen) return;
    this.showNotifications = false;
    this.notificationService.markAsSeen(id);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-wrapper') && !target.closest('.notification-container')) {
      this.showNotifications = false;
    }
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      const user = this.userService.user();
      if (user) this.notificationService.loadMore(user.username);
    }
  }
}
