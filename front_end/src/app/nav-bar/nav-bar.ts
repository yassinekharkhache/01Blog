import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user/user.service';
import { ProfileEditComponent } from '../dialogs/profile-edit/profile-edit';
import { LoginDialog } from '../dialogs/login-dialog/login-dialog';
import { NotificationsComponent } from '../notification/notification';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatBadgeModule, NotificationsComponent],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css'],
})
export class NavBarComponent {
  userService = inject(UserService);
  private dialog = inject(MatDialog);
  @Input() expanded = false;
  @Output() menuToggle = new EventEmitter<void>();

  menuOpen = false;
  showNotifications = false;

  logout() {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
    localStorage.clear();
    sessionStorage.clear();
    this.userService.clearUser();
    window.location.href = '/';
  }

  editProfile() {
    this.dialog.open(ProfileEditComponent);
  }

  openLogin() {
    this.dialog.open(LoginDialog).afterClosed().subscribe((result) => {
      if (result) this.userService.fetchUser();
    });
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-wrapper') && !target.closest('.notification-container')) {
      this.menuOpen = false;
      this.showNotifications = false;
    }
  }
}
