import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostCardDto } from '../../post-card/post-card';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:8081/api/post';

  getAllPosts(lastId: number | null) {
    let params = lastId !== null ? new HttpParams().set('lastId', lastId) : undefined;
    return this.http.get<PostCardDto[]>(`${this.baseUrl}/all`, { params });
  }

  getUserPosts(lastId: number | null,username :string) {
    let params = lastId !== null ? new HttpParams().set('lastId', lastId) : new HttpParams().set('lastId', 0);
    return this.http.get<PostCardDto[]>(`${this.baseUrl}/`+username, { params });
  }

  getFollowingPosts(lastId: number | null) {
    let params = lastId !== null ? new HttpParams().set('lastId', lastId) : undefined;
    return this.http.get<PostCardDto[]>(`${this.baseUrl}/following`, { params });
  }

}

