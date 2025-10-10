import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../modal/user/user-module';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  constructor(private http: HttpClient) {}

  fetchUser() {
    this.http.get<User>('http://localhost:8081/userdata', { withCredentials: true })
      .subscribe({
        next: user => this.userSignal.set(user),
        error: () => this.userSignal.set(null)
      });
  }
}
