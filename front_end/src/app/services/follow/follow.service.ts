import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface FollowResponse {
  isFollowed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'http://localhost:8081/api/follow';

  constructor(private http: HttpClient) {}

  toggleFollow(currentlyFollowed: boolean, username: string): Observable<FollowResponse> {
    if (currentlyFollowed) {
      return this.http.delete(`${this.apiUrl}/delete/${username}`, { responseType: 'text' })
        .pipe(map(() => ({ isFollowed: false })));
    } else {
      return this.http.post(`${this.apiUrl}/add`,{ username }, { responseType: 'text' })
        .pipe(map(() => ({ isFollowed: true })));
    }
  }
}
