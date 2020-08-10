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

  // const params = new HttpParams()
  // .set('id', id);
    
   var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthGoogleAnalyticsAccount?id=` + id, {});

   return res;
  }




  // getGaSetupByCampaignId(campaignId: string): Observable<GoogleAnalyticsAccountSetups[]>  {

  //   return this.http.get<GoogleAnalyticsAccountSetups[]>(`${this.Url}googleanalyticsaccounts/${campaignId}`);
    
  // }

//   getGaSetupByCampaignId(campaignId: string): Observable<GoogleAnalyticsAccountSetups[]> {
//     return this.http.get<GoogleAnalyticsAccountSetups[]>(`${this.Url}googleanalyticsaccounts`, {
//         params: new HttpParams().set('pageSize', '1').set('searchQuery',  "CampaignID==" + campaignId )
//     });
    
// }

getGaSetupByCampaignId(campaignId: string): Observable<GoogleAnalyticsAccountSetups[]> {
  return this.http.get<GoogleAnalyticsAccountSetups[]>(`${this.Url}googleanalyticsaccounts/GetGaAccountByCampaignID?id=` + campaignId);
  
}

// var rootObj1 = new JsonPatchDocument();
// rootObj1.value = qbSetupData.clientSecret;
// rootObj1.path = "/clientSecret";
// rootObj1.op = "replace";

// return this.http.patch<QuickBooksModel>(`${this.apiUrl}qb_authdatas/` + id, [
//     rootObj,
//     rootObj1
// ], {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json-patch+json' })
// });

updateGaAccountProfile(id: string,campaignId: string): Observable<any> {

  var rootObj1 = new JsonPatchDocument();
  rootObj1.value = true;
  rootObj1.path = "/active";
  rootObj1.op = "replace";

return this.http.patch<GoogleAnalyticsAccountSetups>(`${this.Url}googleanalyticsaccounts/` + id,[rootObj1],{  headers: new HttpHeaders({ 'Content-Type': 'application/json-patch+json' }) });
           
}

 //  params: new HttpParams().set('campaignId', campaignId).set('id',id) });
// getGaSetupByCampaignId(campaignId: string): Observable<GoogleAnalyticsAccountSetups[]> {
//   return this.http.get<GoogleAnalyticsAccountSetups[]>(`${this.Url}googleanalyticsaccounts`, {
//       params: new HttpParams().set('pageSize', '1').set('searchQuery',  'CampaignID =='  campaignId )
//   });
// }


// Email.Contains("' + textToSearch + '")

//   getDashboardById(dashboardId: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}edge_dashboards/${dashboardId}`);
// }



}
