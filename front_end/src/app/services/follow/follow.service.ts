import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface FollowResponse {
  isFollowed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = environment.apiUrl + '/api/follow';

  private http = inject(HttpClient)

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
