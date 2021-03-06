import { Injectable } from '@angular/core';
import { IAgency } from './agency.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private productUrl ='assets/server/agency.json';
  constructor (private http: HttpClient){

  }
  
  // using to get agencyList
  getAgency () : Observable<IAgency[]>{

   return this.http.get<IAgency[]>(this.productUrl).pipe(

     tap(data =>  JSON.stringify(data)),
     catchError(this.handleError)

   );
 
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
