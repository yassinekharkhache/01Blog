import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { LoginDialog } from '../dialogs/login-dialog/login-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-side-bar',
  imports: [MatListModule, MatButtonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  @Input() expanded = false;
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  user = this.userService.user;

  handleclick() {
    if (this.userService.user() == null){
      this.openLogin();
    }
  }

  openLogin() {
    this.dialog
      .open(LoginDialog, { width: '350px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) console.log('User logged in:', result);
      });
  }
}
