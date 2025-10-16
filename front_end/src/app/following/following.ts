import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post/post.service';
import { PostCard, PostCardDto } from '../post-card/post-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-following',
  imports: [PostCard,CommonModule],
  templateUrl: './following.html',
  styleUrl: './following.css'
})
export class Following implements OnInit, OnDestroy {

  @ViewChild('sentinel', { static: true }) sentinel!: ElementRef<HTMLElement>;

  posts: PostCardDto[] = [];
  loading = false;
  lastId: number | null = null;
  allLoaded = false;

  private observer?: IntersectionObserver;
  
  constructor(private postService: PostService) {}
  
  ngOnInit(): void {
    this.loadPosts();
    this.initObserver();
  }
  
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  
  private initObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.loading && !this.allLoaded) {
            this.loadPosts();
          }
        });
      },
      {
        root: null,           // observe viewport (null = whole page). Set to container element if using inner scroll.
        rootMargin: '0px 0px 300px 0px', // load earlier
        threshold: 0.1
      }
    );
  
    if (this.sentinel?.nativeElement) {
      this.observer.observe(this.sentinel.nativeElement);
    } else {
      console.warn('Sentinel not available to observe');
    }
  }

  loadPosts(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.postService.getFollowingPosts(this.lastId).subscribe({
      next: (newPosts) => {
        if (newPosts.length === 0) this.allLoaded = true;
        else { this.posts.push(...newPosts); this.lastId = newPosts[newPosts.length - 1].id; }
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

}