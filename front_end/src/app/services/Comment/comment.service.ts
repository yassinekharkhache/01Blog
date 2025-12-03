// src/app/services/comment.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../model/comment/comment.model';
import { environment } from '../../../environment/environment';


@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = environment.apiUrl + '/api/comments';

  private http = inject(HttpClient)

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getComments(postId: number, lastId?: number): Observable<Comment[]> {
    const params: any = lastId ? { lastId } : {};
    return this.http.get<Comment[]>(`${this.baseUrl}/post/${postId}`, { params });
  }

  addComment(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/add`, comment);
  }
}
