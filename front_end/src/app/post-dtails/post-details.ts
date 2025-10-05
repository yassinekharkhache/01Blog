import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { routes } from '../app.routes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.html',
  styleUrls: ['./post-details.css']
})
export class PostDetails implements OnInit {

  postId: string | null = null;
  post: any = null;
  safeContent: SafeHtml | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient){ }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');

    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id');
      console.log(111)
      if (this.postId) {
        this.http.get(`http://localhost:8081/api/post/get/${this.postId}`)
          .subscribe(post => {
            this.post = post;
            this.post.authorProfileImageUrl = `http://localhost:8081${this.post.authorProfileImageUrl}`;
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
          });
      }
    });
  }
}
