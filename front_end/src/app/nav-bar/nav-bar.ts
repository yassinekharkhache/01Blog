import { Component, Input, Output, EventEmitter, HostListener, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatToolbar, MatIconModule, MatBadge],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBarComponent {
  @Input() expanded = false;
  user: any;
  @Output() menuToggle = new EventEmitter<void>();
  menuOpen = false;

  // computed property to get user age reactively
  userAge = computed(() => this.userService.user()?.age);

  constructor(public userService: UserService) {
    // Fetch user info
    this.userService.fetchUser();

    // Reactively log user age whenever it changes
    console.log('User age:', this.userAge());
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
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = '/';
  }

  editProfile() {
    console.log('Edit profile clicked');
  }
}
