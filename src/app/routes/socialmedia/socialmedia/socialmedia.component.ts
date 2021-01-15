import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EMPTY, from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss']
})
export class SocialmediaComponent implements OnInit {

  accessToken;
  tokenType;
  pagelikesTotal;
  constructor(private http: HttpClient,private snackbarService: SnackbarService,private fb: FacebookService) {
    console.log('Initializing Facebook');
    
    fb.init({
      appId: environment.facebook_appid,
      version: 'v9.0'
    });
   }
   login() {
    this.fb.login()
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
      })
      .catch(this.handleError);
  }
  loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      // scope: 'public_profile,user_friends,email,pages_show_list'
      scope: 'pages_show_list'

    };

    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
        debugger
        this.accessToken = res['authResponse'].accessToken;
        this.getPageLikes();
      })
      .catch(this.handleError);

  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  ngOnInit(): void {
    this.authFacebookAccount();
    this.getPageLikes();
    // const initParams: InitParams = {
    //   appId: '1234566778',
    //   xfbml: true,
    //   version: 'v2.8'
    // };
 
    // fb.init(initParams);
  }

  authFacebookAccount() {
    
    const url = "https://graph.facebook.com/oauth/access_token";
    const body = new URLSearchParams();
    body.set('client_id', environment.facebook_appid);
    body.set('client_secret', environment.facebook_appSecret);
    body.set('grant_type', 'client_credentials');
    this.http.post(url, body.toString()).subscribe(res => {
      if (res) {
        
        this.accessToken = res['access_token'];
        this.tokenType = res['token_type'];
      }
    }, error => {
      this.snackbarService.show('Authentication Failed: ' + JSON.stringify(error.error));
    });
  }
  getPageLikes() {
    
    const url = "https://graph.facebook.com/102988865108273?access_token="+this.accessToken +"&fields=country_page_likes";//102988865108273 is page id
    this.http.get(url).subscribe(res => {
      if (res) {
        
        this.pagelikesTotal = res['country_page_likes'];
      }
    }, error => {
      this.snackbarService.show('Fetch Total Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
}
