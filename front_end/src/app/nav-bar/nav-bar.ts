import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  computed,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { UserService } from '../services/user/user.service';
import { ProfileEditComponent } from '../dialogs/profile-edit/profile-edit';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../dialogs/login-dialog/login-dialog';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatToolbar, MatIconModule, MatBadge],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css'],
})
export class NavBarComponent {
  userService = inject(UserService);
  user = this.userService.user;
  @Input() expanded = false;
  @Output() menuToggle = new EventEmitter<void>();
  private dialog = inject(MatDialog);
  menuOpen = false;

  constructor() {
    this.userService.fetchUser();
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    // Remove all cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = '/';
  }

  editProfile() {
    this.dialog.open(ProfileEditComponent);
  }
  openLogin() {
    this.dialog
      .open(LoginDialog)
      .afterClosed()
      .subscribe((result) => {
        if (result) console.log('12-test User logged in:', result);
      });
  }
}
