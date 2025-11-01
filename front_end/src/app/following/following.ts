import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post/post.service';
import { PostCard, PostCardDto } from '../post-card/post-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-following',
  imports: [PostCard, CommonModule, RouterLink],
  templateUrl: './following.html',
  styleUrl: './following.css'
})
export class Following implements OnInit {


  posts: PostCardDto[] = [];
  loading = false;
  lastId: number | null = null;
  allLoaded = false;

  private observer?: IntersectionObserver;
  
  constructor(private postService: PostService) {}
  
  ngOnInit(): void {
    this.loadPosts();
    // this.initObserver();
  }
  
  // ngOnDestroy(): void {
  //   this.observer?.disconnect();
  // }
  
  // private initObserver() {
  //   this.observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach(entry => {
  //         if (entry.isIntersecting && !this.loading && !this.allLoaded) {
  //           this.loadPosts();
  //         }
  //       });
  //     },
  //     {
  //       root: null,
  //       rootMargin: '0px 0px 300px 0px',
  //       threshold: 0.1
  //     }
  //   );
  
  //   if (this.sentinel?.nativeElement) {
  //     this.observer.observe(this.sentinel.nativeElement);
  //   } else {
  //     console.warn('Sentinel not available to observe');
  //   }
  // }

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

  @HostListener('window:scroll', [])
  handleScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const atBottom = scrollHeight - (scrollTop + clientHeight) <= 50;

    if (atBottom && !this.loading && !this.allLoaded) {
      this.loadPosts();
    }
  }

}