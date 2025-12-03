import { Component, HostListener, inject, OnInit } from '@angular/core';
import { PostService } from '../services/post/post.service';
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


  private postService = inject(PostService);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.postService.getAllPosts(this.lastId).subscribe({
      next: (newPosts) => {
        if (newPosts.length === 0) this.allLoaded = true;
        else { this.posts.push(...newPosts); this.lastId = newPosts[newPosts.length - 1].id; }
        this.loading = false;
      },
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
