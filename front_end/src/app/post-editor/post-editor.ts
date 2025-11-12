import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { EditorModule } from '@tinymce/tinymce-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../services/snackBar/stack-bar.service';

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
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.css'],
})
export class BlogEditorComponent {
  private apiBase = 'http://localhost:8081/api';

  imagePreview: File | string | null = null;
  imagePreviewUrl: string | null = null;
  content = signal('');
  title = signal('');
  loading = false;
  router = inject(Router);
  snackbar = inject(SnackbarService);
  http = inject(HttpClient);

  editorConfig: any = {
    height: 500,
    menubar: false,
    plugins: ['image', 'link', 'media', 'paste', 'code', 'lists'],
    toolbar:
      'undo redo | formatselect bold italic underline | image media | code | bullist numlist outdent indent',

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
      return '';
    }
  }

  deleteMedia(type: 'image' | 'video', fileName: string) {
    const url = `${this.apiBase}/upload/${type}/${fileName}`;
    this.http.delete(url).subscribe({
      next: () => console.log(`${type} deleted successfully`),
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
      if (type === 'image') {
        maxSizeInMB = 2;
      } else {
        maxSizeInMB = 10;
      }
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        this.snackbar.show('media is too big', 'error');
        return;
      }

      const url = await this.uploadMedia(file, type);
      if (url) callback(url);
    };
  }


  async submitPost() {
    if (!this.title().trim() || !this.content().trim()) {
        this.snackbar.show('empty field', 'error');
      return

    };

    if (this.title().length >= 100) {
      this.snackbar.show('title is to long', 'error');
      return;
    }
    
    if (this.title().length <= 5) {
      this.snackbar.show('title is to short', 'error');
      return;
    }

    if (this.content().length >= 4000) {
      this.snackbar.show('content is to long', 'error');
      return;
    }

    if (this.content().length <= 50) {
      this.snackbar.show('content is to short', 'error');
      return;
    }

    if (!this.imagePreview) {
      this.snackbar.show('preview image is required', 'error');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('title', this.title());
    formData.append('content', this.content());
    if (this.imagePreview instanceof File) {
      formData.append('image', this.imagePreview);
    }

    try {
      const res = await firstValueFrom(
        this.http.post<{ postId: number }>(`${this.apiBase}/post/add`, formData)
      );

      console.log('Post created: ', res);
      if (res?.postId) {
        this.router.navigate(['/post', res.postId]);
        this.snackbar.show('Post created!', 'success');
      }
    } catch (err: any) {
    } finally {
      this.loading = false;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    const maxSizeInMB = 1;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file) {
      if (file.size > maxSizeInBytes) {
        this.snackbar.show('image is too big','error');
        return;
      }

      this.imagePreview = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }
}
