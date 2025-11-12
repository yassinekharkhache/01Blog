import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportResDto, ReportService } from '../../services/reports/report.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { RouterModule } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-reports-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
    MatOptionModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './reports-table.html',
  styleUrls: ['./reports-table.css'],
})
export class ReportsTable implements OnInit {
  baseApi = environment.apiUrl;
  reports: ReportResDto[] = [];
  loading = false;
  lastId?: number;
  endReached = false;
  selectedAction: { [reportId: number]: string } = {};

  displayedColumns = ['reportId', 'postTitle', 'reason', 'reporter', 'reported', 'createdAt'];

  private http = inject(HttpClient);
  private reportService = inject(ReportService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    if (this.loading || this.endReached) return;
    this.loading = true;
    this.reportService.getReports(this.lastId).subscribe((res) => {
      if (res.length === 0) {
        this.endReached = true;
      } else {
        this.reports.push(...res);
        this.lastId = res[res.length - 1].ReportId;
      }
      this.loading = false;
    });
  }

  async onAction(report: ReportResDto, action: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to ${action}?` },
    });

    const confirmed = await dialogRef.afterClosed().toPromise();

    if (confirmed) {
      console.log(`User confirmed action "${action}" on report ${report.ReportId}`);
      switch (action) {
        case 'deletePost':
          this.http.delete(this.baseApi + '/api/post/delete/' + report.PostId).subscribe({
            next: () => {
              console.log(`Post ${report.PostId} deleted successfully`)
              this.reports = this.reports.filter(r => r.ReportId !== report.ReportId);
            },
          });
          break;
        case 'hidePost':
          this.http.post(this.baseApi + '/api/post/hide', { PostId: report.PostId }).subscribe({
            next: () => {
              console.log(`Post ${report.PostId} hidden successfully`)
              this.reports = this.reports.filter(r => r.ReportId !== report.ReportId);
            },
          });
          this.deleteReport(report.ReportId);
          break;
        case 'deleteReport':
          this.deleteReport(report.ReportId);
          break;
        case 'banUser':
          this.http.post(this.baseApi + '/api/users/ban', { username: report.ReportedUsername }).subscribe({
            next: () => {
              this.reports = this.reports.filter(r => r.ReportId !== report.ReportId);
              console.log(`user ${report.ReportedUsername} banned successfully`);
            },
          });
          this.deleteReport(report.ReportId);
          break;
        case 'deleteUser':
          this.http.delete(this.baseApi + '/api/users/delete/' + report.ReportedUsername).subscribe({
            next: () => console.log(`user ${report.ReportedUsername} deleted successfully`),
          });
          break;
      }
    }
  }
  deleteReport(id: number) {
    this.http.delete(this.baseApi + "/api/report/delete/" + id).subscribe({
      next: () => {
        this.reports = this.reports.filter(r => r.ReportId !== id);
        console.log(`Report ${id} dismissed successfully`);
      },
    });
  }

  // onScroll(event: Event) {
  //   const target = event.target as HTMLElement;
  //   const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
  //   if (atBottom && !this.loading) {
  //     this.loadReports();
  //   }
  // }
  @HostListener('window:scroll', [])
  handleScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const atBottom = scrollHeight - (scrollTop + clientHeight) <= 50;

    if (atBottom && !this.loading) {
      this.loadReports();
    }
  }

  trackById(index: number, item: ReportResDto) {
    return item.ReportId;
  }
}
