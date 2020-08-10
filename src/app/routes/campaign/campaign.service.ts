import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Campaign } from './campaign.model';

@Injectable({
  providedIn: 'root'
})

export class CampaignService {
  selectedCampaign: Campaign;
  campaignList: Campaign[];
  Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createCampaign(campaignSetupData: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(this.Url + 'campaigns', campaignSetupData);
  }
  getCampaign(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.Url + '/campaigns')
  }

}
