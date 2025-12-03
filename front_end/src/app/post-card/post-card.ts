import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

import { LikeService } from '../services/like/likes.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../environment/environment';

export interface PostCardDto {
  id: number;
  title: string;
  content: string;
  postPreviewImage: string;
  authorUsername: string;
  authorProfileImageUrl: string;
  isLiked: boolean;
  likecount: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  imports: [DatePipe, MatIcon, RouterModule],
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css'],
})
export class PostCard {
  @Input() post!: PostCardDto;
  public is_mine: boolean = true;
  public authService = inject(AuthService);
  public likeService = inject(LikeService);
  public userService = inject(UserService);
  private http = inject(HttpClient);
  public BaseApi = environment.apiUrl;


  deletePost(): void {
    this.http.delete(this.BaseApi + `/api/post/delete/${this.post.id}`).subscribe({
      next: (response) => console.log('Post deleted successfully:', response),
    });
    console.log(`Deleting post ID: ${this.post.id}`);
  }

  onLikeClick(): void {
    if (this.userService.user() == null) {
      this.authService.openLogin();
      return;
    }

    this.likeService.toggleLike(this.post.id, this.post.isLiked, this.post.likecount).subscribe({
      next: (res) => {
        this.post.isLiked = res.isLiked;
        this.post.likecount = res.likecount;
      },
    });
  }

  getPostImageUrl(): string {
    return `data:image/jpeg;base64,${this.post.postPreviewImage}`;
  }
}
