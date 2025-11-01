import { Component, inject, Input, OnInit } from '@angular/core';
// date pip
import { DatePipe, NgIf } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

import { LikeService } from '../services/like/likes.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
// Interface matching your postcarddto structure
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
  imports: [DatePipe, MatIcon,RouterModule],
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css'],
})
export class PostCard {
  @Input() post!: PostCardDto;
  public is_mine: boolean = true;
  public authService = inject(AuthService);

  constructor(
    public likeService: LikeService,
    public userService: UserService,
    private http: HttpClient
  ) {}

  deletePost(): void {
    this.http.delete(`http://localhost:8081/api/post/delete/${this.post.id}`).subscribe({
      next: (response) => console.log('Post deleted successfully:', response),
      error: (error) => console.error('Error deleting post:', error),
    });
    console.log(`Deleting post ID: ${this.post.id}`);
  }

  onLikeClick(): void {
    if (this.userService.user() == null){
      this.authService.openLogin();
      return;
    }
    if (this.userService.user() === null){
      return;
    }
    this.likeService.toggleLike(this.post.id, this.post.isLiked, this.post.likecount).subscribe({
      next: (res) => {
        this.post.isLiked = res.isLiked;
        this.post.likecount = res.likecount;
      },
      error: (err) => console.error('Error toggling like:', err),
    });
  }

  getPostImageUrl(): string {
    return `data:image/jpeg;base64,${this.post.postPreviewImage}`;
  }
}
