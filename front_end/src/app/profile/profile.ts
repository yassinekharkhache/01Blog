import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
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
import { AuthService } from '../services/auth/auth.service';

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
  private authService = inject(AuthService);
  userPosts: PostCardDto[] = [];
  loading = false;
  allLoaded = false;
  is_followd: boolean | null = false;
  lastId: number | null = null;
  username: string | null = '';
  isMyProfile = false;

  onFollowClick(): void {
    if (this.userService.user() == null){
      this.authService.openLogin();
      return
    }

    this.followService.toggleFollow(this.is_followd as boolean, this.username as string).subscribe({
      next: (res) => {
        this.is_followd = res.isFollowed;
        this.profileService.fetchUser(this.username as string);
      },
      error: (err) => console.error('Error toggling follow:', err),
    });
  }

  ngOnInit(): void {
    this.allLoaded = false;
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username');
      console.log(this.username);
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

      if (this.userService.user() != null){

        this.http
        .get<{ is_subsciberd: boolean }>(
          `http://localhost:8081/api/follow/is_subsciberd/${this.username}`,
          { withCredentials: true }
        )
        .subscribe({
          next: (data) => (this.is_followd = data.is_subsciberd),
          error: () => (this.is_followd = false),
        });
      }
      
      this.loadPosts();

    });
  }

  loadPosts(): void {
    if (this.loading || this.allLoaded || !this.username) return;
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
