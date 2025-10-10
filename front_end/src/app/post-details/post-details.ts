import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LikeService } from '../services/likes.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';

interface PostDetailsDto {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  authorProfileImageUrl: string;
  likecount: number;
  isliked: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  imports : [MatIconModule,MatButtonModule],
  selector: 'app-post-details',
  templateUrl: './post-details.html',
  styleUrls: ['./post-details.css']
})
export class PostDetails implements OnInit {

  postId: string | null = null;
  post: PostDetailsDto | null = null;
  safeContent: SafeHtml | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    public likeService: LikeService
  ) { }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.http.get<PostDetailsDto>(`http://localhost:8081/api/post/get/${this.postId}`)
        .subscribe(post => {
          this.post = post;
          this.post.authorProfileImageUrl = `http://localhost:8081${post.authorProfileImageUrl}`;
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(post.content);

          // Normalize to match toggleLike input
          if (this.post.isliked === undefined) this.post.isliked = false;
          if (this.post.likecount === undefined) this.post.likecount = 0;
        });
    }
  }

  onLikeClick(): void {
    if (!this.post) return;

    this.likeService.toggleLike(this.post.id, this.post.isliked, this.post.likecount)
      .subscribe({
        next: res => {
          this.post!.isliked = res.isLiked;
          this.post!.likecount = res.likecount;
        },
        error: err => console.error('Error toggling like:', err)
      });
  }
}
