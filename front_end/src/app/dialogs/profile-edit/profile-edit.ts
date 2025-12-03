import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackBar/stack-bar.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ProfileEditComponent {
  email = '';
  username = '';
  pic: File | null = null;
  picPreview: string | null = null;
  age: number | null = null;
  password = '';
  private snackbar = inject(SnackbarService);

  
    private http = inject(HttpClient)
    private dialogRef = inject(MatDialogRef<ProfileEditComponent>)
 

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pic = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.picPreview = reader.result as string);
      reader.readAsDataURL(this.pic);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit(form: NgForm) {
    if (form.invalid) {
      this.snackbar.show('Please fill out all fields correctly.', 'error');
      return;
    }

    const formData = new FormData();

    // Only append non-empty fields
    if (this.pic) {
      formData.append('pic', this.pic);
    }
    if (this.email.trim()) {
      formData.append('email', this.email.trim());
    }
    
    if (this.password.trim()) {
      formData.append('password', this.password.trim());
    }
    if (this.age !== null && !isNaN(this.age)) {
      formData.append('age', this.age.toString());
    }

    this.http.post(environment.apiUrl +'/api/users/update', formData).subscribe({
      next: (res) => {
        this.snackbar.show('Profile updated successfully', 'success');
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.snackbar.show(err.error.message, 'error');
      },
    });
  }
}
