import { Component, inject, EventEmitter, Output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../services/notification/notification.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css'],
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);

  @Output() unseenCountChange = new EventEmitter<number>();

  notifications = this.notificationService.notifications;
  unseenCount = this.notificationService.unseenCount;
  showNotifications = false;

  private loadEffect = effect(() => {
    const user = this.userService.user();
    if (user) this.notificationService.loadNotifications(user.username);
  });

  private emitCountEffect = effect(() => {
    this.unseenCountChange.emit(this.unseenCount());
  });

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAllAsSeen() {
    const user = this.userService.user();
    if (!user) return;
    this.notificationService.markAllAsSeen(user.username);
  }
  
  onScroll(event: Event) {
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    const user = this.userService.user();
    if (user) this.notificationService.loadMore(user.username);
  }
}
}
