import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.css'],
})
export class BlogEditorComponent {
  imagePreview: File | string | null = null;
  imagePreviewUrl: string | null = null;

  content: string = '';
  http = inject(HttpClient);
  title: string = '';
  // imagePreview: File | string | null = null;
  router = inject(Router);

  editorConfig: any = {
    height: 500,
    menubar: false,
    plugins: ['image', 'link', 'media', 'paste', 'code', 'lists', 'heading'],
    toolbar:
      'undo redo | formatselect bold italic underline | image media | code' +
      ' | bullist numlist outdent indent',

    images_upload_handler: (blobInfo: any) => this.uploadMedia(blobInfo.name, 'image'),

    file_picker_types: 'image media',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      const type = meta.filetype === 'image' ? 'image' : 'video';
      this.customMediaHandler(type, callback);
    },
    setup: (editor: any) => {
      let previousMedia: string[] = [];

      const getMediaUrls = () => {
        const content = editor.getContent() || '';
        const imgMatches = Array.from(
          content.matchAll(/<img[^>]+src="([^"]+)"/g)
        ) as RegExpMatchArray[];
        const sourceMatches = Array.from(
          content.matchAll(/<source[^>]+src="([^"]+)"/g)
        ) as RegExpMatchArray[];

        const imgUrls = imgMatches.map((m) => m[1]);
        const videoUrls = sourceMatches.map((m) => m[1]);

        return [...imgUrls, ...videoUrls];
      };

      editor.on('Change', () => {
        const currentMedia = getMediaUrls();
        const deleted = previousMedia.filter((url) => !currentMedia.includes(url));

        deleted.forEach((url) => {
          const type = url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image';
          const fileName = url.split('/').pop()!;
          this.deleteMedia(type, fileName);
        });

        previousMedia = currentMedia;
      });
    },
  };

  async uploadMedia(file: File, type: 'image' | 'video'): Promise<string> {
    console.log(file);
    const formData = new FormData();
    formData.append(type, file);

    const response = await this.http
      .post<{ url: string }>(`http://localhost:8081/api/upload/${type}`, formData)
      .toPromise();
    console.log(response?.url);
    return response?.url || '';
  }

  deleteMedia(type: 'image' | 'video', fileName: string) {
    const url = `http://localhost:8081/api/upload/${type}/${fileName}`;
    return this.http.delete(url).subscribe({
      next: () => console.log(`${type} deleted successfully`),
      error: (err) => console.error(`Failed to delete ${type}: ${err.message}`),
    });
  }

  customMediaHandler(type: 'image' | 'video', callback: (url: string) => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // upload and get real URL
      const url = await this.uploadMedia(file, type);
      if (url) callback(url); // insert only server URL, not base64
    };
  }

  submitPost(title: string) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', this.content);
    if (this.imagePreview) {
      formData.append('image', this.imagePreview);
    }
    this.http
      .post<{ id: number }>('http://localhost:8081/api/post/add', formData)
      .subscribe((res) => {
        console.log(res);
        if (res?.id) {
          this.router.navigate(['/post', res.id]);
        }
      });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagePreview = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }
}
