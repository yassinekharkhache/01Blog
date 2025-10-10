import { Component,Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginDialog } from '../auth/login-dialog/login-dialog';
import { MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
import { BlogEditorComponent } from '../post-editor/post-editor';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-side-bar',
  imports: [MatListModule, MatButtonModule, RouterLink,MatButtonModule,MatIconModule, NgIf],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar implements OnInit {
  @Input() expanded = false;
  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    public userService: UserService
  ) {
    this.userService.fetchUser();
  }
  ngOnInit() {
    this.userService.fetchUser();
  }
  
  handleclick() {
    this.http.get('http://localhost:8081/isLoggedIn', { withCredentials: true }).pipe(
      catchError(err => {
        console.log('[SideBar] Error:', err);
        this.openLogin();
        return of(null);
      })
    ).subscribe();
  }
  
  openLogin() {
    this.dialog.open(LoginDialog, { width: '350px' })
    .afterClosed().subscribe(result => {
      if (result) console.log('12-test User logged in:', result);
    });
  }
}
