import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCard, PostCardDto } from '../post-card/post-card';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostCard],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  @Input() user: any;
  userPosts: PostCardDto[] = [];
  loading = false;
  lastId: number | null = null;
  allLoaded = false;

  constructor(
    public userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.userService.fetchUser(); // should be in ngOnInit, not constructor
    this.loadPosts();
  }

  loadPosts(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    this.postService.getMyPosts(this.lastId).subscribe({
      next: (newPosts) => {
        if (!newPosts.length) {
          this.allLoaded = true;
        } else {
          this.userPosts = [...this.userPosts, ...newPosts]; // immutable update
          this.lastId = newPosts.at(-1)?.id ?? null; // cleaner syntax
        }
      },
      error: (err) => console.error('Error loading posts:', err),
      complete: () => (this.loading = false),
    });
  }
}
