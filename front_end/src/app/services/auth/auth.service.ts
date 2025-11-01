import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { Observable, tap } from 'rxjs';
import { LoginDialog } from '../../dialogs/login-dialog/login-dialog';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private dialog = inject(MatDialog);
  constructor(private http: HttpClient, private userService: UserService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8081/login', { username, password }, {
      withCredentials: true,
    }).pipe(
      tap(() => {
        this.userService.fetchUser();
      })
    );
  }

  register(username: string, password: string, email: string, age: number) {
    return this.http.post('http://localhost:8081/register', 
      { username, password, email, age }, 
      { withCredentials: true }
    );
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