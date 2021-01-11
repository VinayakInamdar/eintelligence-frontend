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
import { Product } from './product.model'
import { environment } from '../../../environments/environment';
import { OpenIdConnectService } from '../../shared/services/open-id-connect.service';
import { FilterOptionModel } from '../../shared/model/filter-option.model';

@Injectable({
    providedIn: 'root'
})

export class ProductsService {
    Url = environment.apiUrl;
    stripepublishablekey =environment.stripe_key;
    stripeSecretKey = environment.stripe_secreTkey;

    constructor(private http: HttpClient, private openIdConnectService: OpenIdConnectService) {
        this.openIdConnectService = openIdConnectService;
    }

    updateProducts(id: string, data: any): Observable<any> {
        return this.http.put<any>(this.Url + `products/${id}`, data);
    }

    createProducts(data): Observable<any> {
        return this.http.post<any>(this.Url + 'products', data);
    }

    deleteProducts(id: string): Observable<any> {
        return this.http.delete<any>(this.Url + `products/${id}`);
    }
    uploadProducts(data): Observable<any> {
        return this.http.post<any>(this.Url + 'attachments/UploadAttachment', data);
    }
    getFilteredProduct(filter: FilterOptionModel): Observable<any> {

        const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
        return this.http.get<any>(`${this.Url}products?${params}`, { observe: 'response' });
    }
    getFilteredPlan(filter: FilterOptionModel): Observable<any> {
        const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
        return this.http.get<any>(`${this.Url}plans?${params}`, { observe: 'response' });
    }
    getProductsByCompanyId(id: string): Observable<any> {
        return this.http.get<any[]>(this.Url + `products/GetProductByCompanyId`, { params: { companyId: id } });
    }
    getPlansByProductId(id: string): Observable<any> {
        return this.http.get<any[]>(this.Url + `plans/GetPlansByProductId`, { params: { productId: id } });
    }
    createPlan(data): Observable<any> {
        return this.http.post<any>(this.Url + 'plans', data);
    }
    deletePlan(id: string): Observable<any> {
        return this.http.delete<any>(this.Url + `plans/${id}`);
    }
    updatePlan(id: string, data: any): Observable<any> {
        return this.http.put<any>(this.Url + `plans/${id}`, data);
    }
    getProduct(id: string): Observable<any> {
        return this.http.get<any>(this.Url + `products/${id}`);
    }
    getPlan(id: string): Observable<any> {
        return this.http.get<any>(this.Url + `plans/${id}`);
    }
    createProductOnStripe(name, description): Observable<any> {
        //require secret key
        const myheader = new HttpHeaders().append('Authorization', 'Bearer '+this.stripeSecretKey);
        const options = {
            headers: myheader,
        };
        let body = new HttpParams();
        body = body.set('name', name);
        body = body.set('description', description);
        return this.http
            .post<any[]>('https://api.stripe.com/v1/products', body, options)
    }
    createStripePrice(data): Observable<any> {
        return this.http.post<any>(this.Url + 'stripepayments/CreateStripePrice', data);
    }
    deleteStripeProduct(id): Observable<any> {
        return this.http.post<any>(this.Url + 'stripepayments/DeleteStripeProduct', id);
    }
    
}

