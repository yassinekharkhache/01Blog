import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule, NgIf } from '@angular/common';
import { PostCard } from '../post-card/post-card';


@Component({
  selector: 'app-profile',
  imports: [CommonModule,PostCard],
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  public userPosts: any[] = userPosts;
  constructor(public UserService: UserService){
    UserService.fetchUser();
  }
}

export const userPosts: any[] = [
  {
    id: 101,
    title: "The Angular Component Lifecycle: A Deep Dive",
    content: "Understanding the lifecycle hooks like ngOnInit, ngOnChanges, and ngOnDestroy is crucial for writing efficient and bug-free Angular applications. This post breaks down when and why each hook is called, providing practical examples for component management and cleanup operations...",
    // Placeholder image: a code snippet background
    postPreviewImage: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?_gl=1*1xkxqu4*_ga*MTAxMzMzMDA4Ny4xNzU5NjYwMjky*_ga_8JE65Q40S6*czE3NTk2NjAyOTIkbzEkZzEkdDE3NTk2NjAyOTQkajU4JGwwJGgw", 
    authorUsername: "yassine",
    // Placeholder avatar: a simple 'Y' on a purple background
    authorProfileImageUrl: "https://via.placeholder.com/30/50009B/FFFFFF?text=Y", 
    likeCount: 45,
    createdAt: "2024-10-01T10:30:00Z",
    updatedAt: "2024-10-01T10:30:00Z"
  },
  {
    id: 102,
    title: "Styling Tips for Modern Blog Interfaces",
    content: "The dark theme is trending! Learn how to use CSS variables, modern grid layouts, and smooth transitions to create a profile page that is both visually striking and accessible. We'll focus on subtle shadows and color pairing to enhance user experience...",
    // Placeholder image: a design/UI background
    postPreviewImage: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?_gl=1*1xkxqu4*_ga*MTAxMzMzMDA4Ny4xNzU5NjYwMjky*_ga_8JE65Q40S6*czE3NTk2NjAyOTIkbzEkZzEkdDE3NTk2NjAyOTQkajU4JGwwJGgw",
    authorUsername: "yassine",
    authorProfileImageUrl: "https://via.placeholder.com/30/50009B/FFFFFF?text=Y",
    likeCount: 128,
    createdAt: "2024-09-25T14:55:00Z",
    updatedAt: "2024-09-25T14:55:00Z"
  },
  {
    id: 103,
    title: "Backend Data Transfer: From Java DTOs to Frontend JSON",
    content: "This tutorial explores the transition of data from a Java Spring Boot backend (like your provided DTO) to an Angular frontend. We cover serialization, handling byte[] image data with Base64 encoding, and ensuring data integrity across the wire...",
    // Placeholder image: a database/server background
    postPreviewImage: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?_gl=1*1xkxqu4*_ga*MTAxMzMzMDA4Ny4xNzU5NjYwMjky*_ga_8JE65Q40S6*czE3NTk2NjAyOTIkbzEkZzEkdDE3NTk2NjAyOTQkajU4JGwwJGgw", 
    authorUsername: "yassine",
    authorProfileImageUrl: "https://via.placeholder.com/30/50009B/FFFFFF?text=Y",
    likeCount: 7,
    createdAt: "2024-10-04T08:00:00Z",
    updatedAt: "2024-10-04T08:00:00Z"
  }
];
