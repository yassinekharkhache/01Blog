import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginDialog } from '../dialogs/login-dialog/login-dialog';
import { MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-side-bar',
  imports: [MatListModule, MatButtonModule, RouterLink, MatButtonModule, MatIconModule, NgIf],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  @Input() expanded = false;
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private userService = inject(UserService);
  user = this.userService.user;
  // ngOnInit() {
  //   this.userService.fetchUser();
  // }

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
