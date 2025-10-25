import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();

  constructor(private http: HttpClient) {}

  addsubscribe() {}

  fetchUser() {
    this.http.get<User>('http://localhost:8081/userdata', { withCredentials: true }).subscribe({
      next: (user) => this.userSignal.set(user),
      error: () => this.userSignal.set(null),
    });
  }

  setUser(user: User) {
    this.userSignal.set(user);
  }

  clearUser() {
    this.userSignal.set(null);
  }
  readonly isLoggedIn = computed(() => !!this.userSignal());
}
