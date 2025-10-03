import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginDialog } from '../login-dialog/login-dialog';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.html',
  styleUrls: ['./register-dialog.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
})


export class RegisterDialog {
  form: FormGroup;
  api = 'http://localhost:8081/register';
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDialog>,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(13)]],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.errorMsg = '';

      this.http.post(this.api, this.form.value).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false;
          console.log('Registration successful', response);
          this.dialogRef.close(this.form.value);
        },
        error: (error) => {
          this.loading = false;
          console.error('Registration failed', error);
          this.errorMsg = 'Registration failed. Please try again.';
        },
      });
    } else {
      this.errorMsg = 'Please fill out all fields correctly.';
    }
  }

  openlogin(){
    this.dialogRef.close();
    this.dialog
    .open(LoginDialog, { width: '350px' })
      .afterClosed()
      .subscribe((result) => {
        if (result){
          console.log('User logged in:', result);
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
