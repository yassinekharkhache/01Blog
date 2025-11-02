import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { CommentService } from '../services/Comment/comment.service';
import { Comment } from '../model/comment/comment.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { environment } from '../../environment/environment';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { SnackbarService } from '../services/snackBar/stack-bar.service';

@Component({
  selector: 'app-comment',
  imports: [DatePipe, FormsModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class CommentsComponent implements OnInit {
  public BaseUrl = environment.apiUrl;
  public userService = inject(UserService);
  public authService = inject(AuthService);
  @Input() postId!: number;
  comments: Comment[] = [];
  loading = false;
  lastId?: number;
  public newCommentContent = '';
  public sending = false;
  public snackbarr = inject(SnackbarService);


  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.loadComments();
  }

  trackById(index: number, item: Comment) {
    return item.id;
  }


  submitComment() {
    if (this.userService.user() == null){
      this.authService.openLogin();
      return;
    }
    if (!this.newCommentContent.trim()){
      this.snackbarr.show('comment is empty', 'error');
      return;
    }
    if (this.newCommentContent.length > 1000){
      this.snackbarr.show('comment is too long', 'error');
      return;
    }
    if (this.newCommentContent.length < 2) {
      this.snackbarr.show('comment is too short', 'error');
      return;
    }

    this.sending = true;
    const comment: Partial<Comment> = {
      content: this.newCommentContent,
      postId: this.postId as any,
    };

    this.commentService.addComment(comment).subscribe({
      next: (saved) => {
        this.comments.unshift(saved);
        this.newCommentContent = '';
        this.sending = false;
      },
      error: () => {
        this.sending = false;
      },
    });
  }


  public loadComments() {
    if (this.loading) return;
    this.loading = true;

    this.commentService.getComments(this.postId, this.lastId).subscribe((res) => {
      this.comments.push(...res);
      if (res.length > 0) this.lastId = res[res.length - 1].id;
      this.loading = false;
    });
  }
  @HostListener('window:scroll', [])
  handleScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const atBottom = scrollHeight - (scrollTop + clientHeight) <= 50;

    if (atBottom && !this.loading) {
      this.loadComments();
    }
  }
}
