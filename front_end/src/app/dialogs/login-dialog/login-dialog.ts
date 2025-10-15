// import { Component } from '@angular/core';
// import { MatDialogContent } from '@angular/material/dialog';
// import { MatFormField, MatLabel } from '@angular/material/form-field';

// @Component({
//   selector: 'app-login-dialog',
//   imports: [MatFormField,MatLabel,MatDialogContent],
//   templateUrl: './login-dialog.html',
//   styleUrls: ['./login-dialog.css']
// })
// export class LoginDialog {
// }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { RegisterDialog } from '../register-dialog/register-dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})

export class LoginDialog {
  username = '';
  password = '';
  api = 'http://localhost:8081/login';
  constructor(
    private dialogRef: MatDialogRef<LoginDialog>,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  openRegister() {
    this.dialogRef.close();
    this.dialog
    .open(RegisterDialog, { width: '350px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) console.log('User logged in:', result);
      });
  }

  submit() {
    const payload = { username: this.username, password: this.password };

    this.http.post(this.api, payload).subscribe({
      next: (response) => {
        document.cookie = `authToken=${encodeURIComponent(
          (response as any).token
        )}; path=/; Secure; SameSite=Strict`;
        console.log(response);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
