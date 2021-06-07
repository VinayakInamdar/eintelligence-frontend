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

export class HomeService {
  Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Ranking graphs
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
  
}