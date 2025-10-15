import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportSearch } from '../report-search/report-search';
import { ReportsTable } from '../reports-table/reports-table';
import { ReportService, ReportResDto } from '../../services/reports/report.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    ReportsTable,
    ReportSearch,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css']
})
export class AdminPannel implements OnInit {
  reports: ReportResDto[] = [];
  filteredReports: ReportResDto[] = [];
  loading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getReports().subscribe({
      next: data => {
        this.reports = data;
        this.filteredReports = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSearch(searchText: string) {
    const lower = searchText.toLowerCase();
    this.filteredReports = this.reports.filter(r =>
      r.PostTitle.toLowerCase().includes(lower) ||
      r.ReporterUsername.toLowerCase().includes(lower) ||
      r.ReportedUsername.toLowerCase().includes(lower)
    );
  }
}
