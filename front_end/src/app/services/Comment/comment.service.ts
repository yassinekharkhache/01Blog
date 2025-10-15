// src/app/services/comment.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../model/comment/comment.model';
import { environment } from '../../../environment/environment';


@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = environment.apiUrl + '/api/comments';

  constructor(private http: HttpClient) {}

  // getComments(postId: number, lastId?: number): Observable<Comment[]> {
  //   let url = `${this.baseUrl}/${postId}`;
  //   if (lastId) url += `?lastId=${lastId}`;
  //   return this.http.get<Comment[]>(url);
  // }

  // addComment(comment: Comment): Observable<Comment> {
  //   return this.http.post<Comment>(this.baseUrl, comment);
  // }
  getComments(postId: number, lastId?: number): Observable<Comment[]> {
    const params: any = lastId ? { lastId } : {};
    return this.http.get<Comment[]>(`${this.baseUrl}/${postId}`, { params });
  }

  addComment(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/add`, comment);
  }
}
