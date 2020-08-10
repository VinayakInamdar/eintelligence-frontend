import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(private http: HttpClient) {


   }
  Url = environment.apiUrl;

  getGaAnalyticsReports(campaignId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaAnalyticsReports?id=` + campaignId);
    
  }

}


