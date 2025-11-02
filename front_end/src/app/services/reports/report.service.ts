import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

export interface ReportResDto {
  ReportId: number;
  PostId: number;
  Reason: string;
  PostTitle: string;
  ReporterUsername: string;
  ReportedUsername: string;
  ReportedRole: string;
  ReporterPicPath: string;
  ReportedPicPath: string;
  CreatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/api/report';

  getReports(lastId?: number): Observable<ReportResDto[]> {

    const url = lastId ? `${this.baseUrl}/get?lastId=${lastId}` : `${this.baseUrl}/get`;
    
    return this.http.get<ReportResDto[]>(url);
  }
}
