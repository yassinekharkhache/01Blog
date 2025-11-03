import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginDialog } from '../login-dialog/login-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackBar/stack-bar.service';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.html',
  styleUrls: ['./register-dialog.css'],
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

  private snackbar = inject(SnackbarService);
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDialog>,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: [null, [Validators.required, Validators.min(13)]],
    });
  }
  validemail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submit(): void {
  if (this.form.valid) {
    this.loading = true;
    this.errorMsg = '';
    this.http.post(this.api, this.form.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.dialogRef.close(this.form.value);
        this.openlogin();
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 409) {
          this.snackbar.show('Email is already taken', 'error');
        } else {
          this.snackbar.show(error, 'error');
        }
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
