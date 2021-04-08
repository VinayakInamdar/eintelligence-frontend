import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GoogleAccountSetups } from './googleAccountSetups.model';
import { GoogleAnalyticsAccountSetups } from './googleAnalyticsAccount.model';
import { JsonPatchDocument } from 'src/app/shared/model/patch/jsonPatchDocument.model';


@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {

  Url = environment.apiUrl;

  constructor(private http: HttpClient) { 

  }




 
  googleAuth(id: string): Observable<any> {
    
    let companyid= localStorage.getItem('companyID');
   var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthGoogleAnalyticsAccount?id=` + id+`&CompanyId=` + companyid, {});
   
   return res;
  }
  refreshGoogleAccount(acccessToken: string, refreshToken:string): Observable<any> {
    
   var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthRefreshGoogleAccount?refreshToken=` + refreshToken+`&accessToken=` + acccessToken, {});
   
   return res;
  }
  googleAdsAuth(id: string): Observable<any> {
    
    let companyid= localStorage.getItem('companyID');
    var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthGoogleAdsAccount?id=` + id+`&CompanyId=` + companyid, {});
 
    return res;
   }

  // using to get google analytics setup of selected campaign Id
getGaSetupByCampaignId(campaignId: string): Observable<GoogleAnalyticsAccountSetups[]> {
  return this.http.get<GoogleAnalyticsAccountSetups[]>(`${this.Url}googleanalyticsaccounts/GetGaAccountByCampaignID?id=` + campaignId);
  
}


updateGaAccountProfile(id: string,campaignId: string): Observable<any> {

  var rootObj1 = new JsonPatchDocument();
  rootObj1.value = true;
  rootObj1.path = "/active";
  rootObj1.op = "replace";

return this.http.patch<GoogleAnalyticsAccountSetups>(`${this.Url}googleanalyticsaccounts/` + id,[rootObj1],{  headers: new HttpHeaders({ 'Content-Type': 'application/json-patch+json' }) });
           
}




}
