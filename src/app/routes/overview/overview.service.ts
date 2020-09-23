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

   // using to get google analytics traffic sources report of selected campaign Id, Start Date , End Date
   GetTrafficSourcesReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetTrafficSourcesReports?id=` + campaignId,{
       params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
    });
    
  }

   // using to get google analytics sources-mediums report of selected campaign Id, Start Date , End Date
   GetTrafficSourcesMediumsReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetTrafficSourcesMediumsReports?id=` + campaignId,{
       params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
    });
    
  }

   // using to get google analytics campaigns report of selected campaign Id, Start Date , End Date
   GetCampaignReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetCampaignReports?id=` + campaignId,{
       params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
    });
    
  }

   // using to get google analytics audience report of selected campaign Id, Start Date , End Date
   GetAudienceReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetAudienceReports?id=` + campaignId,{
       params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
    });
    
  }

   // using to get google analytics device-category report of selected campaign Id, Start Date , End Date
   GetDeviceCategoryReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetDeviceCategoryReports?id=` + campaignId,{
       params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
    });
    
  }

       // using to get google analytics geolocation report of selected campaign Id, Start Date , End Date
       GetGeoLocationReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
        return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGeoLocationReports?id=` + campaignId,{
           params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
        });
        
      }
      // using to get google analytics language report of selected campaign Id, Start Date , End Date
      GetLanguageReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
        return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetLanguageReports?id=` + campaignId,{
           params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
        });
        
      }

      // using to get google analytics behavior report of selected campaign Id, Start Date , End Date
      GetGaBehaviorAnalyticsReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
        return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaBehaviorAnalyticsReports?id=` + campaignId,{
           params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
        });
        
      }

        // using to get google analytics conversions report of selected campaign Id, Start Date , End Date
        GetGaConversionsAnalyticsReports(campaignId: string,startDate:string,endDate:string): Observable<any[]> {
          return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaConversionsAnalyticsReports?id=` + campaignId,{
             params: new HttpParams().set("startDate", startDate).set("endDate",endDate)
          });
          
        }

 


}


