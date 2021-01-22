import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {
  clientId;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  //----------------------------------------------
  // const body = new HttpParams()
  //   .set('client_id', 'XXX')
  //   .set('client_secret', 'XXX')
  //   .set('grant_type', 'authorization_code')
  //   .set('redirect_uri', `${location.protocol}//${location.hostname + (location.port ? ':' + location.port : '')}/`)
  //   .set('code', igcode)

  //   return this.http.post('https://api.instagram.com/oauth/access_token',
  //   body.toString(),
  //   {
  //       headers: new HttpHeaders()
  //       .set('Content-Type', 'application/x-www-form-urlencoded')
  //   }
  //   );
  // getAccessToken() {
  //   const api = 'https://www.instagram.com/oauth/authorize/';
  
  //   const params: HttpParams = new HttpParams()
  //     .set('client_id', this.clientId)
  //     .set('redirect_uri', 'http://localhost:4200/instagram/')
  //     .set('response_type', 'code');
  
  //   return this.http.get<any[]>(api, {params})
  //   .map((response) => response)
  // }
//     authInstagramAccount() {
//       debugger
//     const url = "https://www.instagram.com/oauth/authorize";
//     const body = new URLSearchParams();
//     body.set('client_id', environment.facebook_appid);
//     body.set('client_secret', environment.facebook_appSecret);
//     body.set('grant_type', 'client_credentials');
//     body.set('redirect_uri', 'http://localhost:4200/instagram/')

//     this.http.post(url, body.toString()).subscribe(res => {
//       if (res) {
// debugger
//       }
//     }, error => {
//       alert(JSON.stringify(error.error));
//       // this.snackbarService.show('Authentication Failed: ' + JSON.stringify(error.error));
//     });
//   }
  //----------------------------------------------
}
