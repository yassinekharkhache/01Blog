import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { PostCardDto } from '../post-card/post-card';
import { PostCard } from '../post-card/post-card';
import { CommonModule } from '@angular/common';

@Component({
  imports: [PostCard, CommonModule],
  selector: 'app-explore',
  templateUrl: './explore.html',
  styleUrls: ['./explore.css'],
})
export class Explore implements OnInit {
  posts: PostCardDto[] = [];
  loading = false;
  lastId: number | null = null;
  allLoaded = false;

  private scrollThreshold = 300; // pixels from bottom
  private lastScrollTime = 0;
  private scrollThrottle = 200; // ms

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    this.postService.getAllPosts(this.lastId).subscribe({
      next: (newPosts) => {
        if (newPosts.length === 0) {
          this.allLoaded = true;
        } else {
          this.posts.push(...newPosts);
          this.lastId = newPosts[newPosts.length - 1].id;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.loading = false;
      },
    });
  }

onScroll(event: any): void {
  const element = event.target;
  console.log('Scrolled to bottom');
  if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    this.loadPosts();
  }
}
}
