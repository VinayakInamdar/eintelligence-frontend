import { Injectable, ErrorHandler } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { IProduct } from './product.model';
// import { StripePayment } from './stripepayment.model';
import { Observable, throwError } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OpenIdConnectService } from '../../shared/services/open-id-connect.service';
import { FilterOptionModel } from '../../shared/model/filter-option.model';

@Injectable({
    providedIn: 'root'
})

export class MyPaymentsService {
    Url = environment.apiUrl;


    constructor(private http: HttpClient, private openIdConnectService: OpenIdConnectService) {
        this.openIdConnectService = openIdConnectService;
    }
    getFilteredStripepayments(filter: FilterOptionModel): Observable<any> {
        
        const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
        return this.http.get<any>(`${this.Url}stripepayments?${params}`, { observe: 'response' });
    }
    deleteStripeSuscription(id: string): Observable<any> {
        
        const myheader = new HttpHeaders().append('Authorization', 'Bearer '+environment.stripe_secreTkey);
        const options = {
           headers: myheader
        }
        return 
        this.http.delete<any>('https://api.stripe.com/v1/subscriptions/'+id, options)
    }
  
}

