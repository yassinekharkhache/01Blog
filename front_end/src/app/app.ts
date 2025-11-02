import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SideBar } from './side-bar/side-bar';
import { NavBarComponent } from './nav-bar/nav-bar';
import { SnackbarComponent } from './snackbar/snackbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { NotificationService } from './services/notification/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, NavBarComponent, MatIconModule, MatDialogModule, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('01Blog_front');
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  private router = inject(Router);


  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          // Example: reload notifications on every path change
          const user = this.notificationService.userService.user();
          if (user) this.notificationService.loadNotifications(user.username);
          this.notificationService.loadUnseenCount();
        });
    });
  }



}

