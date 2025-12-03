import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user/user.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  private http =  inject(HttpClient);

  fetchUser(username :string) {
    this.http.get<User>(environment.apiUrl+'/api/users/get/'+username, { withCredentials: true })
      .subscribe({
        next: user => this.userSignal.set(user),
        error: () => this.userSignal.set(null)
      });
  }
}