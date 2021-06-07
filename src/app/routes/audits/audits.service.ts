import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../../core/settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuditsService {

  constructor(private http: HttpClient,
    private settingService: SettingsService) { }
  Url = environment.apiUrl;

  // using to audit given url 
  settingsTaskWebsite(websiteUrl: string): Observable<any[]> {
    var companyID;
    if (this.settingService.selectedCompanyInfo.companyId != "") {
      companyID = this.settingService.selectedCompanyInfo.companyId;
    } else {
      companyID = null;
    }
    return this.http.post<any[]>(`${this.Url}audits/SettingTasks`, {}, {
      params: new HttpParams().set("websiteUrl", websiteUrl).set("CompanyID", companyID)
    });
  }

  //using to get list of audits
  getAudits(): Observable<any[]> {
    return this.http.get<any[]>(this.Url + 'audits/', {
      params: new HttpParams().set('pageSize', '1000')
    })
  }

  // using to get onPageReport of selected taskId
  getOnPageData(taskID: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.Url}audits/GetOnPageByTaskId`, {}, {
      params: new HttpParams().set("taskID", taskID)
    });
  }
}
