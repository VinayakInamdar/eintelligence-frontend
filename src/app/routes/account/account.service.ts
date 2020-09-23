import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CompanyInformation } from './account/companyinformation.model';
import { catchError,tap, combineAll } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private productUrl ='assets/server/agency.json';
  Url = environment.apiUrl;
  constructor (private http: HttpClient){

  }

  getAgency () : Observable<CompanyInformation[]>{

   return this.http.get<CompanyInformation[]>(this.Url).pipe(

     tap(data =>  JSON.stringify(data)),
     catchError(this.handleError)

   );
 
 }
  
 
 getCompany(companyId : string): Observable<CompanyInformation[]> {
  return this.http.get<CompanyInformation[]>(this.Url + 'companys/' + companyId)
}

  updateCompany(companyId : string,selectedCompany: any) : Observable<CompanyInformation[]> {
    return this.http.put<CompanyInformation[]>(this.Url + 'companys/' + companyId,selectedCompany)
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
