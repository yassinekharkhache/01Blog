import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCard, PostCardDto } from '../post-card/post-card';
import { PostService } from '../services/post/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,PostCard],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  user: any = null;
  userPosts: PostCardDto[] = [];
  loading = false;
  lastId: number | null = null;
  allLoaded = false;
  username: string | null = '';

  constructor(
    public profileService: ProfileService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    if (!this.username || this.username === 'null') {
      this.router.navigate(['/explore']);
      return;
    }
    if (this.username) {
      this.profileService.fetchUser(this.username);
    }else{
      this.username = "yassine";
    }
    this.loadPosts()
  }

  loadPosts(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.postService.getUserPosts(this.lastId, this.username as string).subscribe({
      next: (newPosts) => {
        if (!newPosts.length) {
          this.allLoaded = true;
        } else {
          this.userPosts = [...this.userPosts, ...newPosts];
          this.lastId = newPosts.at(-1)?.id ?? null;
        }
      },
      error: (err) => console.error('Error loading posts:', err),
      complete: () => (this.loading = false),
    });
  }
}
