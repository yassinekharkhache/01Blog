import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  constructor(private http: HttpClient) {}

  fetchUser(username :string) {
    this.http.get<User>('http://localhost:8081/api/users/'+username, { withCredentials: true })
      .subscribe({
        next: user => this.userSignal.set(user),
        error: () => this.userSignal.set(null)
      });
  }
}