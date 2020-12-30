import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IProduct } from './product.model';
import { StripePayment } from './stripepayment.model';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  Url = environment.apiUrl;
  private productUrl = 'assets/server/products.json';
  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<IProduct[]> {

    return this.http.get<IProduct[]>(this.productUrl).pipe(

      tap(data => JSON.stringify(data)),
      catchError(this.handleError)

    );

  }
  // using to create new campaign in db 
  createStripePayment(data): Observable<any> {
    
    return this.http.post<StripePayment>(this.Url + 'stripepayments', data);
  }

  CreateStripePaymentCheckout(data): Observable<any> {
    
    return this.http.post<StripePayment>(this.Url + 'stripepayments/CreateStripePaymentCheckout', data);
  }
  CreateCheckoutSessionResponse(data): Observable<any> {
    
    return this.http.post<StripePayment>(this.Url + 'stripepayments/CreateCheckoutSessionResponse', data);
  }
  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
