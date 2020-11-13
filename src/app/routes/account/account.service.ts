import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CompanyInformation } from './account/companyinformation.model';
import { catchError,tap, combineAll } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserInfo } from 'os';
import { User } from '../user/user.model';



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

//  getUser(userId:string): Observable<CompanyInformation[]> {
//   // return this.http.get<CompanyInformation[]>(`${this.Url}companys/GetCompanyDetails?userId=` + userId)

//   return this.http.get<any[]>(this.Url + 'aspusers',{
//     params: {
//       searchQuery: 'Id=' + userId + ' && pageSize=' + 1000
//      }
//   })
// }

// params: {
//   searchQuery: 'Id==\"' + userId + '\" && pageSize==\"' + 1000 + '\" ' , orderBy: "UpdatedOn desc"
// }
  

    

getUser(userId:string): Observable<User[]> {
  return this.http.get<User[]>(`${this.Url}aspusers/GetUserDetails?userId=` + userId)
}

 
 getCompany(userId:string): Observable<CompanyInformation[]> {
  return this.http.get<CompanyInformation[]>(`${this.Url}companys/GetCompanyDetails?userId=` + userId)
}


updateUser(userId : string,selectedUser: any) : Observable<User[]> {
  return this.http.put<User[]>(this.Url + 'aspusers/' + userId, selectedUser)
}



  updateCompany(companyId : string,selectedCompany: any) : Observable<CompanyInformation[]> {
    return this.http.put<CompanyInformation[]>(this.Url + 'companys/' + companyId, selectedCompany)
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
