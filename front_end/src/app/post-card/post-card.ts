import { Component, Input, OnInit } from '@angular/core';
// date pip
import { DatePipe, NgIf } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

import { LikeService } from '../services/like/likes.service';
import { RouterModule } from '@angular/router';
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
export class PostCard implements OnInit {
  @Input() post!: PostCardDto;
  public is_mine: boolean = true;
  constructor(
    public likeService: LikeService,
    public userService: UserService,
    private http: HttpClient
  ) {}

  editPost(): void {
    console.log(`Editing post ID: ${this.post.id}`);
  }

  deletePost(): void {
    this.http.delete(`http://localhost:8081/api/post/delete/${this.post.id}`).subscribe({
      next: (response) => console.log('Post deleted successfully:', response),
      error: (error) => console.error('Error deleting post:', error),
    });
    console.log(`Deleting post ID: ${this.post.id}`);
  }

  ngOnInit(): void {
    this.userService.fetchUser();
    if (!this.post) {
      console.error('Post data is required for PostCard.');
    }
  }

  onLikeClick(): void {
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
  viewPostDetails(): void {
    console.log(`Viewing post ID: ${this.post.id}`);
  }
}
