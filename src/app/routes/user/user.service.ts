import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})

export class UserService {
  selectedUser: User;
  userList: User[];
  Url = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.Url + 'aspusers')
  }


  createUser(userSetupData: User): Observable<User> {
    return this.http.post<User>(this.Url + 'aspusers/InviteUser', userSetupData);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.Url + 'aspusers/' + id);
  }
  updateUser(id: string, selectedUser: any): Observable<User> {
    return this.http.put<User>(this.Url + 'aspusers/' + id, selectedUser);

  }

  deleteUserById(id: number): Observable<User> {
    return null //return this.http.delete<User>(this.Url + 'users/' + id);
  } 

}