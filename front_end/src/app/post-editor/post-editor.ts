import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }, // ✅ local TinyMCE
  ],
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.css'],
})
export class BlogEditorComponent {
  content: string = '';
  http = inject(HttpClient);
  title: string = 'test title';
  imagePreview: File | string | null = null;

  editorConfig: any = {
    height: 500,
    menubar: false,
    plugins: ['image', 'link', 'media', 'paste', 'code', 'lists', 'heading'],
    toolbar:
      'undo redo | bold italic underline | image media | code' +
      ' | bullist numlist outdent indent' +
      ' | alignleft aligncenter alignright alignjustify',
    images_upload_handler: (blobInfo: any) => this.uploadMedia(blobInfo.blob(), 'image'),
    file_picker_types: 'image media',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      const type = meta.filetype === 'image' ? 'image' : 'video';
      this.customMediaHandler(type, callback);
    },
  };

  async uploadMedia(file: File, type: 'image' | 'video'): Promise<string> {
    const formData = new FormData();
    formData.append(type, file);

    const response = await this.http
      .post<{ url: string }>(`http://localhost:8081/api/upload/${type}`, formData)
      .toPromise();

    return response?.url || '';
  }

  customMediaHandler(type: 'image' | 'video', callback: (url: string) => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // show preview
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);

      const url = await this.uploadMedia(file, type);
      if (url) callback(url);
    };
  }

  submitPost() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('content', this.content);
    if (this.imagePreview) {
      formData.append('image', this.imagePreview);
    }
    this.http
      .post('http://localhost:8081/api/post/add', formData)
      .subscribe(() => alert('Post submitted!'));
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagePreview = file; // ✅ keep the File object
    }
  }
}
