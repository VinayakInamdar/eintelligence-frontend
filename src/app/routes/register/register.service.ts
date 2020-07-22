import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
//import { Register } from './register.model';
import { User } from '../user/user.model';


@Injectable({
  providedIn: 'root'
})

export class RegisterService {
  // // selectedRegister : Register;
  // // registerList: Register[];
  
  // selectedUser: User;
  // userList: User[];
  // Url = environment.apiUrl;

  // constructor(private http: HttpClient) { }

  // // createRegiter(registerSetupData: Register): Observable<Register> {
  // //   return this.http.post<Register>(this.Url + 'aspusers/InviteUser', registerSetupData);
  // // }
  // createUser(userSetupData: User): Observable<User> {
  //   return this.http.post<User>(this.Url + 'aspusers/InviteUser', userSetupData);
  // }
}
