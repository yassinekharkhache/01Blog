// snackbar.component.ts
import { Component, effect } from '@angular/core';
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
  constructor(public service: SnackbarService) {}
}

