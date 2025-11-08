import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackbarService } from '../../services/snackBar/stack-bar.service';

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './report-dialog.html',
  styleUrls: ['./report-dialog.css'],
})
export class ReportDialogComponent {
  snackbarr = inject(SnackbarService);
  form: FormGroup;
  loading = false;
  api = 'http://localhost:8081/api/report/add';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; type: string }
  ) {
    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(12)]],
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;


    const payload = {
      reason: this.form.value.reason,
      ReportType: this.data.type,
      Id: this.data.id,
    };
    console.log(payload);

    this.http.post(this.api, payload).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.snackbarr.show('report submited', 'success');
        this.cancel();
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
