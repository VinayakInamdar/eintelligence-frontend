import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(private http: HttpClient) {


   }
  Url = environment.apiUrl;
  // using to get google analytics report of selected campaign Id, Start Date , End Date
  getGaAnalyticsReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaAnalyticsReports?id=` + campaignId,{
      params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
   });
    
  }
  
    // using to get google analytics report of selected campaign Id, Start Date , End Date
  getGaAnalyticsReportsByDateRange(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaAnalyticsReports?id=` + campaignId,{
       params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
    });
    
  }

 


}


