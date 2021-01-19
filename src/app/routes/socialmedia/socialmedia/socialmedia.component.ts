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
  profileViewTotal;
  pageNewlikesTotal
  pageImpressionsTotal;
  pageReachTotal;
  pageToken;
  userId = '105114094889635';
  pageClicksTotal;
  positiveFeedback;
  negativeFeedback;
  lostLikes;
  organicReach;
  paidReach;
  topCountry;
  topReferrer;
  constructor(private http: HttpClient, private snackbarService: SnackbarService, private fb: FacebookService) {
    fb.init({
      appId: environment.facebook_appid,
      version: 'v9.0'
    });
  }
  login() {
    this.fb.login()
      .then((res: LoginResponse) => {
        this.accessToken = res['authResponse'].accessToken;
        this.testApi();
        console.log('Logged in', res);
      })
      .catch(this.handleError);
  }
  loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      // scope: 'public_profile,user_friends,email,pages_show_list'
      //scope: 'pages_show_list'
      scope: 'pages_show_list,read_insights,pages_read_engagement'
    };

    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
        this.accessToken = res['authResponse'].accessToken;
        this.generatePageToken();
        this.getPageLikes();
        //this.getProfileViewCount();
        this.getPageNewLikes();
        //this.testApi();
      })
      .catch(this.handleError);

  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  ngOnInit(): void {
  }
  generatePageToken() {
    const url = "https://graph.facebook.com/" + this.userId + "/accounts?access_token=" + this.accessToken;
    // const url = "https://graph.facebook.com/105114094889635/accounts?access_token=EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.pageToken = res['data'][0].access_token;
        this.getPageReachCount();
        this.getTotalClicksCount();
        this.getPositiveFeedbackCount();
        this.getNegativeFeedbackCount();
        this.getProfileViewCount();
        this.getPageImpression();
      }
    }, error => {
      this.snackbarService.show('Fetch Page Token Failed : ' + JSON.stringify(error.error));
    });
  }
  getPageLikes() {
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "?access_token=" + this.accessToken + "&fields=new_like_count";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.pageNewlikesTotal = res['new_like_count'];
      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getPageNewLikes() {
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "?access_token=" + this.accessToken + "&fields=country_page_likes";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.pagelikesTotal = res['country_page_likes'];
      }
    }, error => {
      this.snackbarService.show('Fetch Total Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getProfileViewCount() {
    
  //page_views_unique Page Views from users logged into Facebook day
  const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_views_total?access_token=" + this.pageToken;
  //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
  this.http.get(url).subscribe(res => {
    if (res) {
      
      let p = res['data'][2];
      let l = p['values'];
      this.profileViewTotal = 0;
      for (let i = 0; i < l.length; i++) {
        this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[i].value)
      }
    }
  }, error => {
    this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
  });
  }
  getPageImpression() {
    debugger
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        let p = res['data'][2];
        let l = p['values'];
        this.pageImpressionsTotal = 0;
        for (let i = 0; i < l.length; i++) {
          this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[i].value)
        }
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
    }
  getPageReachCount() {
    //page_views_unique Page Views from users logged into Facebook day
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique?access_token=" + this.pageToken;
    //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
    this.http.get(url).subscribe(res => {
      if (res) {
        let p = res['data'][2];
        let l = p['values'];
        this.pageReachTotal = 0;
        for (let i = 0; i < l.length; i++) {
          this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[i].value)
        }
        // this.pageReachTotal = parseInt(l[0].value) + parseInt(l[1].value);
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getTotalClicksCount() {
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_total_actions?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        let p = res['data'][2];
        let l = p['values'];
        this.pageClicksTotal = 0;
        for (let i = 0; i < l.length; i++) {
          this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[i].value)
          // this.pageClicksTotal = parseInt(l[0].value) + parseInt(l[1].value);
        }
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Clicks Count Failed : ' + JSON.stringify(error.error));
    });
  }

  getPositiveFeedbackCount() {
    
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_positive_feedback_by_type?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        
        let p = res['data'][2];
        let l = p['values'];
        this.positiveFeedback = 0;
        for (let i = 0; i < l.length; i++) {
          if (l[i].value['other']) {
            this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[i].value['other']);
          }
          if (l[i].value['like']) {
            this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[i].value['like']);
          }
          if (l[i].value['comment']) {
            this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[i].value['comment']);
          }
          // this.pageClicksTotal = parseInt(l[0].value) + parseInt(l[1].value);
        }

      }
    }, error => {
      this.snackbarService.show('Fetch Total Positive Feedback Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getNegativeFeedbackCount() {
    
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_negative_feedback?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        
        let p = res['data'][2];
        let l = p['values'];
        this.negativeFeedback = parseInt(l[0].value) + parseInt(l[1].value);
        this.negativeFeedback = 0;
        for (let i = 0; i < l.length; i++) {
          if (l[i].value['other']) {
            this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[i].value['other']);
          }
          if (l[i].value['like']) {
            this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[i].value['like']);
          }
          if (l[i].value['comment']) {
            this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[i].value['comment']);
          }
          // this.pageClicksTotal = parseInt(l[0].value) + parseInt(l[1].value);
        }
      }
    }, error => {
      this.snackbarService.show('Fetch Total Positive Feedback Count Failed : ' + JSON.stringify(error.error));
    });
  }
  testApi() {
    //page_views_unique Page Views from users logged into Facebook day
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique?access_token=" + this.accessToken;

    this.http.get(url).subscribe(res => {
      if (res) {

        this.profileViewTotal = res['page_views_unique'];
      }
    }, error => {
      this.snackbarService.show('Fetch Total Profile View Count Failed : ' + JSON.stringify(error.error));
    });
  }
  //this not in used but working for facebook authentication
  // authFacebookAccount() {
  //   const url = "https://graph.facebook.com/oauth/access_token";
  //   const body = new URLSearchParams();
  //   body.set('client_id', environment.facebook_appid);
  //   body.set('client_secret', environment.facebook_appSecret);
  //   body.set('grant_type', 'client_credentials');
  //   this.http.post(url, body.toString()).subscribe(res => {
  //     if (res) {

  //       this.accessToken = res['access_token'];
  //       this.tokenType = res['token_type'];
  //     }
  //   }, error => {
  //     this.snackbarService.show('Authentication Failed: ' + JSON.stringify(error.error));
  //   });
  // }
}
