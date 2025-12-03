import { Injectable, signal } from '@angular/core';

export interface SnackbarMessage {
  text: string;
  type?: 'success' | 'error' | 'info';
}

@Injectable(
  { providedIn: 'root' }
)
export class SnackbarService {
  private messageSignal = signal<SnackbarMessage | null>(null);
  readonly message = this.messageSignal.asReadonly();

  show(text: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) {
    this.messageSignal.set({ text, type });
    setTimeout(() => this.messageSignal.set(null), duration);
  }
}