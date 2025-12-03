import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user/user.model';
import { firstValueFrom, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();

  private http = inject(HttpClient)

  addsubscribe() { }

  fetchUser(): Promise<User | null> {
    return firstValueFrom(
      this.http.get<User | null>(environment.apiUrl+'/userdata', { withCredentials: true }).pipe(
        tap(user => this.userSignal.set(user)),
        catchError(() => {
          this.userSignal.set(null);
          return of(null);
        })
      )
    );
  }


  setUser(user: User) {
    this.userSignal.set(user);
  }

  clearUser() {
    this.userSignal.set(null);
  }

  readonly isLoggedIn = computed(() => !!this.userSignal());
}
