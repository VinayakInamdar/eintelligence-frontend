import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Campaign } from './campaign.model';
import { SerpDto } from '../seo/serp.model';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';

@Injectable({
  providedIn: 'root'
})

export class CampaignService {
  selectedCampaign: Campaign;
  campaignList: Campaign[];
  Url = environment.apiUrl;

  constructor(private http: HttpClient,private openIdConnectService: OpenIdConnectService) { }
  
  // using to create new campaign in db 
  createCampaign(campaignSetupData: Campaign): Observable<Campaign> {
    if(localStorage.getItem('companyID') ){
      campaignSetupData.companyID = localStorage.getItem('companyID'); 
    }
    
    return this.http.post<Campaign>(this.Url + 'campaigns', campaignSetupData);
  }

  // using to get list of campaign
  // getCampaign(): Observable<any[]> {
  //   if(localStorage.getItem('companyID') ){
  //     var companyID = localStorage.getItem('companyID'); 
  //   }
  //   return this.http.get<any[]>(this.Url + 'campaigns',{
  //     params: new HttpParams().set('pageSize', '1000')
  //   })
  // }
  getCampaign(userid): Observable<any[]> {
      return this.http.get<any[]>(`${this.Url}campaigns/GetCampaignByUserId?userId=` + userid)
  }
  // using to get list of keywords
  getSerp(startDate:string,endDate:string): Observable<any[]> {
    return this.http.get<any[]>(this.Url + '/serps',{
      params: new HttpParams().set('pageSize', '1000').set("startDate", startDate).set("endDate",endDate)
    })
  }
  // using to add new keyword in selected campaign Id
  addNewKeyword(CampaignID :string,Keyword : any,Location : string,Tags : any,startDate:string,endDate:string): Observable<SerpDto> {
    return this.http.post<SerpDto>(`${this.Url}serps/GetSerpData`,{},{
      params: new HttpParams().set('CampaignID', CampaignID).set('Keywords', Keyword.join(',')).set('Location', Location).set('Tags', Tags).set("startDate", startDate).set("endDate",endDate)
    });
    
  }

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
