import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Authority } from './authority.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthorityService {
  selectedAuthority: Authority;
  authorityList: Authority[];
  Url = environment.apiUrl;
  authority: Authority;

  constructor(private http: HttpClient) { }

  //Get Authority List
  getAuthorityList(): Observable<Authority[]> {
    return this.http.get<Authority[]>(this.Url + 'authoritys')
  }

  //Create Authority List
  createAuthority(authorityData: Authority): Observable<Authority> {
    return this.http.post<Authority>(this.Url + 'authoritys', authorityData)
  }
}