import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { FilterOptionModel } from '../../shared/model/filter-option.model';
@Injectable({
  providedIn: 'root'
})

export class GscDataService {
  Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Ranking graphs
  getFilteredgscsummarys(filter: FilterOptionModel): Observable<any> {
    const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
    return this.http.get<any>(`${this.Url}gscsummarys?${params}`, { observe: 'response' });
  }
  creategscsummarys(data): Observable<any> {
    return this.http.post<any>(this.Url + 'gscsummarys', data);
  }
  deletegscsummarys(id: string): Observable<any> {
    return this.http.delete<any>(this.Url + `gscsummarys/${id}`);
  }
  
}