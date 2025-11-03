// snackbar.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../services/snackBar/stack-bar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.html',
  styleUrls: ['./snackbar.css'],
})
export class SnackbarComponent {
  public service = inject(SnackbarService);
  get msg() {
    return this.service.message();
  }
}
