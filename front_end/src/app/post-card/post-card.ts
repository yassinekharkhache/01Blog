import { Component, Input, OnInit } from '@angular/core';

// Interface matching your postcarddto structure
export interface PostCardDto {
  id: number;
  title: string;
  content: string;
  postPreviewImage: string; // Assuming byte[] is converted to a base64 string or URL
  authorUsername: string;
  authorProfileImageUrl: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCard implements OnInit {
  // Input property to receive the post data
  @Input() post!: PostCardDto;

  constructor() { }

  ngOnInit(): void {
    // Basic validation to ensure data is present
    if (!this.post) {
      console.error('Post data is required for the PostCardComponent.');
    }
  }

  // Helper function to handle the byte[] image data (assuming it's Base64)
  getPostImageUrl(): string {
    // If your backend returns a Base64 string directly:
    // return `data:image/jpeg;base64,${this.post.postPreviewImage}`;
    
    // For this component, we will assume postPreviewImage is a URL or a Base64 string already formatted for an <img> src.
    return this.post.postPreviewImage;
  }
  
  // Example for handling a button click (like)
  onLikeClick(): void {
    // Implement logic to send a request to like/unlike the post
    console.log(`Liked post ID: ${this.post.id}`);
  }

  // Example for navigation
  viewPostDetails(): void {
    // Implement logic to navigate to the full post view
    console.log(`Viewing post ID: ${this.post.id}`);
  }
}