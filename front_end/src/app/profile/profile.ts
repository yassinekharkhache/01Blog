import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCard, PostCardDto } from '../post-card/post-card';
import { PostService } from '../services/post/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';
import { Notfound } from '../notfound/notfound';
import { FollowService } from '../services/follow/follow.service';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, CommonModule, PostCard, Notfound],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  public followService = inject(FollowService);
  public profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  private postService = inject(PostService);
  private userService = inject(UserService);
  userPosts: PostCardDto[] = [];
  loading = false;
  allLoaded = false;
  is_followd: boolean | null = false;
  lastId: number | null = null;
  username: string | null = '';
  isMyProfile = false;
  
  onFollowClick(): void {
    this.followService.toggleFollow(this.is_followd as boolean, this.username as string).subscribe({
      next: (res) => {
        this.is_followd = res.isFollowed;
        this.profileService.fetchUser(this.username as string);
      },
      error: (err) => console.error('Error toggling follow:', err),
    });
  }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username');
      if (!this.username || this.username === 'null') {
        this.router.navigate(['/explore']);
        return;
      }
      this.userPosts = [];
      this.lastId = null;
      this.allLoaded = false;

      this.profileService.fetchUser(this.username);
      const user = this.userService.user();
      this.isMyProfile = !!user && user.username === this.username;

      this.http
        .get<{ is_subsciberd: boolean }>(
          `http://localhost:8081/api/follow/is_subsciberd/${this.username}`,
          { withCredentials: true }
        )
        .subscribe({
          next: (data) => (this.is_followd = data.is_subsciberd),
          error: () => (this.is_followd = false),
        });

      this.loadPosts();
    });
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
