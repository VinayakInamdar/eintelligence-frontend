import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Campaign } from './campaign.model';
import { SerpDto } from '../seo/serp.model';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { FilterOptionModel } from '../../shared/model/filter-option.model';
@Injectable({
  providedIn: 'root'
})

export class CampaignService {
  selectedCampaign: Campaign;
  campaignList: Campaign[];
  Url = environment.apiUrl;

  constructor(private http: HttpClient, private openIdConnectService: OpenIdConnectService) { }

  //Delete Keyword
  deleteKeywordById(id: string): Observable<SerpDto> {
    return this.http.delete<SerpDto>(this.Url + 'serps/' + id);
  }
  //Get Campaign
  getcampaign(id: string): Observable<any> {
    return this.http.get<any>(this.Url + `campaigns/${id}`);
  }
  //Update Campaign
  updatecampaign(id: string, selectedCampaign: Campaign): Observable<Campaign> {
    return this.http.put<Campaign>(this.Url + 'campaigns/' + id, selectedCampaign);
  }
  // using to create new campaign in db 
  createCampaign(campaignSetupData: Campaign): Observable<Campaign> {
    if (localStorage.getItem('companyID')) {
      campaignSetupData.companyID = localStorage.getItem('companyID');
    }

    return this.http.post<Campaign>(this.Url + 'campaigns', campaignSetupData);
  }
  //Delete Campaign
  deleteCampaignById(id: string): Observable<Campaign> {
    return this.http.delete<Campaign>(this.Url + 'campaigns/' + id);
  }
  getFilteredRankingGraph(filter: FilterOptionModel): Observable<any> {

    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}rankinggraphs?${params}`, { observe: 'response' });
  }
  createRankingGraph(data): Observable<any> {
    return this.http.post<any>(this.Url + 'rankinggraphs', data);
  }
  deleteRankingGraph(id: string): Observable<any> {
    return this.http.delete<any>(this.Url + `rankinggraphs/${id}`);
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
  getSerpLocations(location: string): Observable<SerpDto> {
    return this.http.post<SerpDto>(`${this.Url}serps/GetSerpLocationData`, {}, {
      params: new HttpParams().set('location', location)
    });
  }
  GetUpdateKeywordsStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}serps/GetUpdateKeywordsStatus`)

  }
  googleAuth(id: string): Observable<any> {
    
    let companyid= localStorage.getItem('companyID');
   var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthGoogleAnalyticsAccount?id=` + id+`&CompanyId=` + companyid, {});
   
   return res;
  }
  authGoogleRestSharp(code): Observable<any> {
    
   var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthGoogleRestSharp?code=` + code, {});
   return res;
  }
  authRefreshGoogleAccount(code): Observable<any> {
    
   var res =this.http.post<any>(`${this.Url}googleanalyticsaccounts/AuthRefreshGoogleAccount?code=` + code, {});
   return res;
  }
  getCampaign(userid): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}campaigns/GetCampaignByUserId?userId=` + userid)
  }
  // using to get list of keywords
  getSerp(searchParam: string): Observable<any[]> {
    return this.http.get<any[]>(this.Url + '/serps', {
      params: new HttpParams().set('pageSize', '1000').set("searchParam", searchParam)
    })
  }

  getSerpForKeyword(filter: FilterOptionModel, searchParam: string): Observable<any> {
    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}serps?${params}`, {
      params: new HttpParams().set('pageSize', '1000').set("searchParam", searchParam)
    });
  }
  addNewKeyword(CampaignID: string, Keyword: any, Location: string,LocationName:string, searchParam: string): Observable<SerpDto> {
    return this.http.post<SerpDto>(`${this.Url}serps/GetSerpData`, {}, {
      params: new HttpParams().set('CampaignID', CampaignID).set('Keywords', Keyword.join(',')).set('Location', Location).set('LocationName', LocationName).set('searchParam', "&tbs=qdr:m")
    });

  }

  // using to add new keyword in selected campaign Id
  // addNewKeyword(CampaignID: string, Keyword: any, Location: string, searchParam: string): Observable<SerpDto> {
  //   return this.http.post<SerpDto>(`${this.Url}serps/GetSerpData`, {}, {
  //     params: new HttpParams().set('CampaignID', CampaignID).set('Keywords', Keyword.join(',')).set('Location', Location).set('searchParam', "&tbs=qdr:m")
  //   });

  // }

  // using to get google analytics report of selected campaign Id, Start Date , End Date
  getGaAnalyticsReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaAnalyticsReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics report of selected campaign Id, Start Date , End Date
  getGaAnalyticsReportsByDateRange(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaAnalyticsReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics traffic sources report of selected campaign Id, Start Date , End Date
  GetTrafficSourcesReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetTrafficSourcesReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics sources-mediums report of selected campaign Id, Start Date , End Date
  GetTrafficSourcesMediumsReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetTrafficSourcesMediumsReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics campaigns report of selected campaign Id, Start Date , End Date
  GetCampaignReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetCampaignReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics audience report of selected campaign Id, Start Date , End Date
  GetAudienceReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetAudienceReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics device-category report of selected campaign Id, Start Date , End Date
  GetDeviceCategoryReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetDeviceCategoryReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics geolocation report of selected campaign Id, Start Date , End Date
  GetGeoLocationReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGeoLocationReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }
  // using to get google analytics language report of selected campaign Id, Start Date , End Date
  GetLanguageReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetLanguageReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics behavior report of selected campaign Id, Start Date , End Date
  GetGaBehaviorAnalyticsReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaBehaviorAnalyticsReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }

  // using to get google analytics conversions report of selected campaign Id, Start Date , End Date
  GetGaConversionsAnalyticsReports(campaignId: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.Url}googleanalyticsaccounts/GetGaConversionsAnalyticsReports?id=` + campaignId, {
      params: new HttpParams().set("startDate", startDate).set("endDate", endDate)
    });

  }
  createGoogleAnalytics(data): Observable<any> {
    return this.http.post<any>(this.Url + 'googleaccountsetups', data);
  }
  createGA(data): Observable<any> {
    return this.http.post<any>(this.Url + 'campaigngoogleanalyticss', data);
  }
  updateGA(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.Url + `campaigngoogleanalyticss/${id}`, data);
}
  createGSC(data): Observable<any> {
    return this.http.post<any>(this.Url + 'campaigngscs', data);
  }
  updateGSC(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.Url + `campaigngscs/${id}`, data);
}
  createGAds(data): Observable<any> {
    return this.http.post<any>(this.Url + 'campaigngoogleadss', data);
  }
  createFacebook(data): Observable<any> {
    return this.http.post<any>(this.Url + 'campaignfacebooks', data);
  }
  updateFacebook(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.Url + `campaignfacebooks/${id}`, data);
}
  getFilteredGA(filter: FilterOptionModel): Observable<any> {
    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}campaigngoogleanalyticss?${params}`, { observe: 'response' });
  }
  getFilteredGSC(filter: FilterOptionModel): Observable<any> {
    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}campaigngscs?${params}`, { observe: 'response' });
  }
  getFilteredGAds(filter: FilterOptionModel): Observable<any> {
    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}campaigngoogleadss?${params}`, { observe: 'response' });
  }
  getFilteredFacebook(filter: FilterOptionModel): Observable<any> {
    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}campaignfacebooks?${params}`, { observe: 'response' });
  }

}
