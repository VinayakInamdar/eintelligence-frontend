import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Campaign } from './campaign.model';
import { SerpDto } from '../keywords/serp.model';

@Injectable({
  providedIn: 'root'
})

export class CampaignService {
  selectedCampaign: Campaign;
  campaignList: Campaign[];
  Url = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  // using to create new campaign in db 
  createCampaign(campaignSetupData: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(this.Url + 'campaigns', campaignSetupData);
  }

  // using to get list of campaign
  getCampaign(): Observable<any[]> {
    return this.http.get<any[]>(this.Url + '/campaigns',{
      params: new HttpParams().set('pageSize', '50')
    })
  }

  // using to get list of keywords
  getSerp(): Observable<any[]> {
    return this.http.get<any[]>(this.Url + '/serps',{
      params: new HttpParams().set('pageSize', '50')
    })
  }
  // using to add new keyword in selected campaign Id
  addNewKeyword(CampaignID :string,Keyword : any,Location : string,Tags : any): Observable<SerpDto> {
    return this.http.post<SerpDto>(`${this.Url}serps/GetSerpData`,{},{
      params: new HttpParams().set('CampaignID', CampaignID).set('Keywords', Keyword.join(',')).set('Location', Location).set('Tags', Tags)
    });
    
  }
}
