import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LikeService } from '../services/like/likes.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { FollowService } from '../services/follow/follow.service';
import { CommentsComponent } from '../comment/comment';
import { UserService } from '../services/user/user.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../dialogs/report-dialog/report-dialog';
import { Notfound } from '../notfound/notfound';
import { Comment } from '../model/comment/comment.model';
import { AuthService } from '../services/auth/auth.service';

interface PostDetailsDto {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  authorProfileImageUrl: string;
  likecount: number;
  isliked: boolean;
  isfollow: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    DatePipe,
    CommentsComponent,
    MatMenu,
    MatMenuTrigger,
    Notfound,
    RouterModule
  ],
  selector: 'app-post-details',
  templateUrl: './post-details.html',
  styleUrls: ['./post-details.css'],
})

export class PostDetails implements OnInit {
  postId: string | null = null;
  post: PostDetailsDto | null = null;
  safeContent: SafeHtml | null = null;
  is_followd: boolean | null = false;
  is_mine: boolean | null = false;
  postNotFound = false;
  loading = false;
  comments: Comment[] = [];
  lastId?: number = 0;

  public followService = inject(FollowService);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public likeService = inject(LikeService);
  public userService = inject(UserService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  public nbrId: number = 0;

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.nbrId = Number(this.postId);
    if (this.postId) {
      this.http.get<PostDetailsDto>(`http://localhost:8081/api/post/get/${this.postId}`).subscribe({
        next: (post) => {
          this.post = post;
          this.post.authorProfileImageUrl = `http://localhost:8081${post.authorProfileImageUrl}`;
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
          if (this.post.isliked === undefined) this.post.isliked = false;
          if (this.post.likecount === undefined) this.post.likecount = 0;
          this.is_followd = this.post.isfollow ?? false;
          this.is_mine = this.post.authorUsername === this.userService.user()?.username;
        },
        error: () => (this.postNotFound = true),
      });
    }
  }

  onEditClick() {
    if (!this.post) return;
    this.router.navigate(['/post/edit', this.post.id]);
  }

  onFollowClick(): void {
    if (this.userService.user() == null) {
      this.authService.openLogin();
      return;
    }
    if (!this.post) return;

    this.followService.toggleFollow(this.is_followd!, this.post.authorUsername).subscribe({
      next: (res) => {
        this.is_followd = res.isFollowed;
      },
    });
  }

  openReportDialog() {
    if (this.userService.user() == null) {
      this.authService.openLogin();
      return;
    }
    const postId = this.postId;
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      data: { id : postId,type:"POST" },
    });

    dialogRef.afterClosed().subscribe((submitted) => {
      if (submitted) {
        console.log('Report submitted for post ID:', postId);
      }
    });
  }

  onLikeClick(): void {
    if (this.userService.user() == null) {
      this.authService.openLogin();
      return;
    }
    if (!this.post) return;

    this.likeService.toggleLike(this.post.id, this.post.isliked, this.post.likecount).subscribe({
      next: (res) => {
        this.post!.isliked = res.isLiked;
        this.post!.likecount = res.likecount;
      },
    });
  }

  onDeleteClick() {
    this.http.delete(`http://localhost:8081/api/post/delete/${this.nbrId}`).subscribe({
      next: () => {
        console.log(`Post ${this.nbrId} deleted successfully`);
        this.router.navigate(['/']);
      },
    });
  }
}
