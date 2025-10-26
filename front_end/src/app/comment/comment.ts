import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../services/Comment/comment.service';
import { Comment } from '../model/comment/comment.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { environment } from '../../environment/environment';

@Component({
  selector: 'app-comment',
  imports: [DatePipe, FormsModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class CommentsComponent implements OnInit {
  public BaseUrl = environment.apiUrl;
  @Input() postId!: number;
  comments: Comment[] = [];
  loading = false;
  lastId?: number;
  public newCommentContent = '';
  public sending = false;

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
  }

  trackById(index: number, item: Comment) {
    return item.id;
  }

  loadComments() {
    if (this.loading) return;
    this.loading = true;

    this.commentService.getComments(this.postId, this.lastId).subscribe((res) => {
      this.comments.push(...res);
      if (res.length > 0) this.lastId = res[res.length - 1].id;
      this.loading = false;
    });
  }

  submitComment() {
    if (!this.newCommentContent.trim()) return;

    this.sending = true;
    const comment: Partial<Comment> = {
      content: this.newCommentContent,
      postId: this.postId as any,
    };

    this.commentService.addComment(comment).subscribe({
      next: (saved) => {
        console.log(saved);
        this.comments.unshift(saved);
        this.newCommentContent = '';
        this.sending = false;
      },
      error: () => {
        this.sending = false;
      },
    });
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

    if (atBottom && !this.loading) {
      this.loadComments();
    }
  }
}
