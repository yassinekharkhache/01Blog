import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {User} from '../modal/user/user-module'

@Injectable({
  providedIn: 'root'
})



export class UserService {

  constructor(private http: HttpClient) {}

  public userSignal = signal<User | null>(null); 

  fetchUser() {
      this.http.get<User>('http://localhost:8081/userdata', { withCredentials: true })
      .subscribe({
        next: (user) => this.userSignal.set(user),
        error: (err) => {
          this.userSignal.set(null);
        }
      });
      console.log("this.userSignal")
      console.log(this.userSignal)
  }

  getUser() {
    return this.userSignal();
  }
}
