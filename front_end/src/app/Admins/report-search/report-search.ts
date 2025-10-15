import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-report-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './report-search.html',
  styleUrl: './report-search.css',
})

export class ReportSearch {
  searchText: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchText.trim());
  }

  clear() {
    this.searchText = '';
    this.onSearch();
  }
}
