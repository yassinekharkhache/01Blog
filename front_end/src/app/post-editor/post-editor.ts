import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';
import Quill from 'quill';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './post-editor.html',
  styleUrls: ['./post-editor.css'],
})
export class BlogEditorComponent {
  content: string = '';
  http = inject(HttpClient);
  quill: Quill | null = null;

  editorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ header: [1, 2, 3, false] }],
        ['image', 'video', 'code-block'],
      ],
      handlers: {
        image: () => this.customMediaHandler('image'),
        video: () => this.customMediaHandler('video'),
      },
    },
  };

  onEditorCreated(quillInstance: Quill) {
    this.quill = quillInstance;
  }

  customMediaHandler(type: 'image' | 'video') {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', type === 'image' ? 'image/*' : 'video/*');
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append(type, file);

      try {
        // Send to the correct backend endpoint
        console.log(">>>>>>>>>> debug 53");
        const response = await this.http
          .post<{ url: string }>(`http://localhost:8081/api/upload/${type}`, formData)
          .toPromise();

        const url = response?.url; // <-- this URL is decided by backend
        if (url && this.quill) {
          const range = this.quill.getSelection(true);

          if (type === 'image') {
            this.quill.insertEmbed(range?.index || 0, 'image', url, 'user');
          } else if (type === 'video') {
            this.quill.insertEmbed(range?.index || 0, 'video', url, 'user');
          }

          // Move cursor after embed
          this.quill.setSelection((range?.index || 0) + 1);
        }
      } catch (err) {
        console.error(`${type} upload failed`, err);
      }
    };
  }

  submitPost() {
    const post = {
      title: 'Test Post',
      content: this.content,
    };

    this.http.post('http://localhost:8081/api/post/add', post).subscribe({
      next: () => alert('Post submitted!'),
      error: (err) => console.log('>>>>>>>>>>>>>>', err),
    });
  }
}
