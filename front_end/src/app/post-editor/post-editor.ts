import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'assets/tinymce/tinymce.min.js' }],
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.css'],
})
export class BlogEditorComponent {
  private apiBase = 'http://localhost:8081/api';

  imagePreview: File | string | null = null;
  imagePreviewUrl: string | null = null;
  content = '';
  title = '';
  loading = false;
  router = inject(Router);
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  editorConfig: any = {
    height: 500,
    menubar: false,
    plugins: ['image', 'link', 'media', 'paste', 'code', 'lists', 'heading'],
    toolbar:
      'undo redo | formatselect bold italic underline | image media | code | bullist numlist outdent indent',

    // ✅ Corrected upload handler
    images_upload_handler: async (blobInfo: any) => {
      const file = blobInfo.blob();
      return await this.uploadMedia(file, 'image');
    },

    file_picker_types: 'image media',
    file_picker_callback: (callback: any, _value: any, meta: any) => {
      const type = meta.filetype === 'image' ? 'image' : 'video';
      this.customMediaHandler(type, callback);
    },

    setup: (editor: any) => {
      let previousMedia: string[] = [];

      const getMediaUrls = () => {
        const content = editor.getContent() || '';
        const imgUrls = [...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
        const videoUrls = [...content.matchAll(/<source[^>]+src="([^"]+)"/g)].map((m) => m[1]);
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
    try {
      const formData = new FormData();
      formData.append(type, file);

      const response = await firstValueFrom(
        this.http.post<{ url: string }>(`${this.apiBase}/upload/${type}`, formData)
      );

      console.log(`${type} uploaded:`, response.url);
      return response.url || '';
    } catch (err) {
      console.error(`Failed to upload ${type}:`, err);
      return '';
    }
  }

  deleteMedia(type: 'image' | 'video', fileName: string) {
    const url = `${this.apiBase}/upload/${type}/${fileName}`;
    this.http.delete(url).subscribe({
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

      let maxSizeInMB;
      if (type === 'image'){
        maxSizeInMB = 2;
      }else{
        maxSizeInMB = 10;
      }
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;


      if (file.size > maxSizeInBytes) {
        this.snackBar.open('media is too big', 'Close', {
          duration: 3000,
        });
        return;
      }

      const url = await this.uploadMedia(file, type);
      if (url) callback(url);
    };
  }

  async submitPost() {
    if (!this.title.trim() || !this.content.trim()) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('content', this.content);
    if (this.imagePreview instanceof File) {
      formData.append('image', this.imagePreview);
    }

    try {
      const res = await firstValueFrom(
        this.http.post<{ id: number }>(`${this.apiBase}/post/add`, formData)
      );

      if (res?.id) {
        console.log('Post created:', res.id);
        this.router.navigate(['/post', res.id]);
      }
    } catch (err) {
      console.error('Failed to submit post:', err);
    } finally {
      this.loading = false;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    const maxSizeInMB = 1;
    const maxSizeInBytes = maxSizeInMB * 10240 * 1024;

    if (file) {
      if (file.size > maxSizeInBytes) {
        this.snackBar.open('image is too big', 'Close', {
          duration: 3000,
        });
        return;
      }

      this.imagePreview = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }
  
}
