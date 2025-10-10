import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostCardDto } from '../post-card/post-card';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private apiUrl = 'http://localhost:8081/api/post/all';

  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:8081/api/post';
  // getAllPosts(lastId: number | null): Observable<PostCardDto[]> {
  //   let params = new HttpParams();
  //   if (lastId !== null) {
  //     params = params.set('lastId', lastId);
  //   }
  //   return this.http.get<PostCardDto[]>(this.apiUrl, { params });
  // }

  getAllPosts(lastId: number | null) {
    let params = lastId !== null ? new HttpParams().set('lastId', lastId) : undefined;
    return this.http.get<PostCardDto[]>(`${this.baseUrl}/all`, { params });
  }

  getMyPosts(lastId: number | null) {
    let params = lastId !== null ? new HttpParams().set('lastId', lastId) : undefined;
    return this.http.get<PostCardDto[]>(`${this.baseUrl}/my_posts`, { params });
  }

  getSavedPosts(lastId: number | null) {
    let params = lastId !== null ? new HttpParams().set('lastId', lastId) : undefined;
    return this.http.get<PostCardDto[]>(`${this.baseUrl}/saved_posts`, { params });
  }
}

