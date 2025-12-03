import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportsTable } from '../reports-table/reports-table';
import { ReportService, ReportResDto } from '../../services/reports/report.service';
import { UserSearch } from '../user-search/user-search';
import {MatTabsModule} from '@angular/material/tabs';
import { PostSearch } from '../post-search/post-search';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    ReportsTable,
    UserSearch,
    MatProgressSpinnerModule,
    PostSearch,
    MatTabsModule
  ],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css']
})
export class AdminPannel implements OnInit {
  reports: ReportResDto[] = [];
  filteredReports: ReportResDto[] = [];
  loading = true;
  private reportService = inject(ReportService)

  ngOnInit() {
    this.reportService.getReports().subscribe({
      next: data => {
        this.reports = data;
        this.filteredReports = data;
        this.loading = false;
      },
      error: () => {
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
