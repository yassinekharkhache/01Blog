// like.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface LikeResponse {
  isLiked: boolean;
  likecount: number;
}

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:8081/api/like';

  constructor(private http: HttpClient) {}

  toggleLike(postId: number, currentlyLiked: boolean, currentCount: number): Observable<LikeResponse> {
    if (currentlyLiked) {
      return this.http.delete(`${this.apiUrl}/${postId}`, { responseType: 'text' }).pipe(
        map(() => ({ isLiked: false, likecount: Math.max(0, currentCount - 1) }))
      );
    } else {
      return this.http.post(`${this.apiUrl}/${postId}`, '', { responseType: 'text' }).pipe(
        map(() => ({ isLiked: true, likecount: currentCount + 1 }))
      );
    }
  }
}
