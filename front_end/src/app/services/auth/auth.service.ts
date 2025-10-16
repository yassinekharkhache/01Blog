import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
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
}