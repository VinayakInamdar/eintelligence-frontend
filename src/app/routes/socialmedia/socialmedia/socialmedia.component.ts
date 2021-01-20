import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EMPTY, from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { positionElements } from 'ngx-bootstrap/positioning';
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
  userId;
  userName;
  pageClicksTotal;
  //------------feedback
  positiveFeedback;
  negativeFeedback;
  totalfeedback;
  percentPositive
  percentNegative
  //----------------
  organicLikes;
  percentOrganicLikes;
  paidLikes;
  percentPaidLikes;
  lostLikes;
  organicReach;
  percentOrganicReach;
  percentPaidReach;
  paidReach;
  topCountry;
  topReferrer;
  pageUnlikeList;
  externalReferrerList;
  avgProfileView;
  avgNewLikes;
  avgPageClicks;
  avgLostLikes;
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
        this.getUserId();
        this.getPageLikes();
        this.getPageNewLikes();
      })
      .catch(this.handleError);

  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  ngOnInit(): void {
    this.pageUnlikeList = [{ "source": "1", "count": "2", "percent": "3" }, { "source": "4", "count": "5", "percent": "6" }];
    this.externalReferrerList = [{ "url": "1", "count": "2", "percent": "3" }, { "url": "4", "count": "5", "percent": "6" }];
  }
  getUserId() {

    const url = "https://graph.facebook.com/me?access_token=" + this.accessToken + "&fields=id,name";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.userId = res['id'];
        this.userName = res['name'];
        this.generatePageToken();
      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  generatePageToken() {

    const url = "https://graph.facebook.com/" + this.userId + "/accounts?access_token=" + this.accessToken;
    // const url = "https://graph.facebook.com/105114094889635/accounts?access_token=EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD";
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        this.pageToken = res['data'][0].access_token;
        this.getAllData28Days();
        // this.getPageReachCount();
        // this.getTotalClicksCount();
        //this.getPositiveFeedbackCount();
        // this.getNegativeFeedbackCount();
        // this.getProfileViewCount();
        // this.getPageImpression();
        //this.getTotalExternamReferrer();
        //this.getPageUnlikeBySOurceCount();
        //this.getPageReachOrganicCount();
        //this.getPageReachPaidCount();
        // this.getTotalLikesLost();
      }
    }, error => {
      this.snackbarService.show('Fetch Page Token Failed : ' + JSON.stringify(error.error));
    });
  }
  onSelect(period) {
    this.getAllDataByPeriod(period);
//     if(period=='day'){
// this.getAllDataOneDays();
//     }
//     if(period=='week'){
//       this.getAllDataWeek();
//     }
//     if(period=='days_28'){
      
//     }
  }
  getAllDataByPeriod(period) {
    debugger
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        for (let i = 0; i < res['data'].length; i++) {
          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique' && p.period == period) {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
          }
          //Clicks
          if (p.name == 'page_total_actions' && p.period == period) {
            let l = p['values'];
            this.pageClicksTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
            }
          }
          //positive feedback
          if (p.name == 'page_positive_feedback_by_type' && p.period == period) {
            let l = p['values'];
            this.positiveFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['comment']);
              }
            }
          }
          //negative feedback
          if (p.name == 'page_negative_feedback' && p.period == period) {
            let l = p['values'];
            this.negativeFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['comment']);
              }
            }
            this.totalfeedback = parseInt(this.positiveFeedback) + parseInt(this.negativeFeedback)
            this.percentPositive = this.getPercentage(parseInt(this.positiveFeedback), parseInt(this.totalfeedback));
            if(this.percentPositive =='NaN'){this.percentPositive = 0;}
            this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));
            if(this.percentNegative =='NaN'){this.percentNegative = 0;}

          }
          //Profile view count
          if (p.name == 'page_views_total' && p.period == period) {
            let l = p['values'];
            this.profileViewTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            }
            this.avgProfileView = this.getAverage(this.profileViewTotal, 28);
          }
          //Page Impressions
          if (p.name == 'page_impressions' && p.period == period) {
            let l = p['values'];
            this.pageImpressionsTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            }
          }

          //Page External Referrer
          if (p.name == 'page_views_external_referrals' && p.period == period) {
            let l = p['values'];
            this.externalReferrerList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            // }
          }
          //Page Unlike 
          if (p.name == 'page_fans_by_unlike_source_unique' && p.period == period) {
            let l = p['values'];
            this.pageUnlikeList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            // }
          }
          //Organic Reach
          if (p.name == 'page_impressions_organic' && p.period == period) {
            let l = p['values'];
            this.organicReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
            }
          }
          //Paid Reach
          if (p.name == 'page_impressions_paid' && p.period == period) {
            let l = p['values'];
            this.paidReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
            }
            this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
            this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
            this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
          }
          //Lost Likes
          if (p.name == 'page_fan_removes_unique' && p.period == period) {
            let l = p['values'];
            this.lostLikes = 0;
            for (let k = 0; k < l.length; k++) {
              this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
            }
          }
        }

      }
    }, error => {
      this.snackbarService.show('Fetch Data Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllDataWeek() {
    debugger
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        for (let i = 0; i < res['data'].length; i++) {
          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique' && p.period == 'week') {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
          }
          //Clicks
          if (p.name == 'page_total_actions' && p.period == 'week') {
            let l = p['values'];
            this.pageClicksTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
            }
          }
          //positive feedback
          if (p.name == 'page_positive_feedback_by_type' && p.period == 'week') {
            let l = p['values'];
            this.positiveFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['comment']);
              }
            }
          }
          //negative feedback
          if (p.name == 'page_negative_feedback' && p.period == 'week') {
            let l = p['values'];
            this.negativeFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['comment']);
              }
            }
            this.totalfeedback = parseInt(this.positiveFeedback) + parseInt(this.negativeFeedback)
            this.percentPositive = this.getPercentage(parseInt(this.positiveFeedback), parseInt(this.totalfeedback));
            this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));
          }
          //Profile view count
          if (p.name == 'page_views_total' && p.period == 'week') {
            let l = p['values'];
            this.profileViewTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            }
            this.avgProfileView = this.getAverage(this.profileViewTotal, 28);
          }
          //Page Impressions
          if (p.name == 'page_impressions' && p.period == 'week') {
            let l = p['values'];
            this.pageImpressionsTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            }
          }

          //Page External Referrer
          if (p.name == 'page_views_external_referrals' && p.period == 'week') {
            let l = p['values'];
            this.externalReferrerList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            // }
          }
          //Page Unlike 
          if (p.name == 'page_fans_by_unlike_source_unique' && p.period == 'week') {
            let l = p['values'];
            this.pageUnlikeList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            // }
          }
          //Organic Reach
          if (p.name == 'page_impressions_organic' && p.period == 'week') {
            let l = p['values'];
            this.organicReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
            }
          }
          //Paid Reach
          if (p.name == 'page_impressions_paid' && p.period == 'week') {
            let l = p['values'];
            this.paidReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
            }
            this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
            this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
            this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
          }
          //Lost Likes
          if (p.name == 'page_fan_removes_unique' && p.period == 'week') {
            let l = p['values'];
            this.lostLikes = 0;
            for (let k = 0; k < l.length; k++) {
              this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
            }
          }
        }

      }
    }, error => {
      this.snackbarService.show('Fetch Data Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllData28Days() {
    debugger
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        for (let i = 0; i < res['data'].length; i++) {
          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique' && p.period == 'days_28') {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
          }
          //Clicks
          if (p.name == 'page_total_actions' && p.period == 'days_28') {
            let l = p['values'];
            this.pageClicksTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
            }
          }
          //positive feedback
          if (p.name == 'page_positive_feedback_by_type' && p.period == 'days_28') {
            let l = p['values'];
            this.positiveFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['comment']);
              }
            }
          }
          //negative feedback
          if (p.name == 'page_negative_feedback' && p.period == 'days_28') {
            let l = p['values'];
            this.negativeFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['comment']);
              }
            }
            this.totalfeedback = parseInt(this.positiveFeedback) + parseInt(this.negativeFeedback)
            this.percentPositive = this.getPercentage(parseInt(this.positiveFeedback), parseInt(this.totalfeedback));
            this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));
          }
          //Profile view count
          if (p.name == 'page_views_total' && p.period == 'days_28') {
            let l = p['values'];
            this.profileViewTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            }
            this.avgProfileView = this.getAverage(this.profileViewTotal, 28);
          }
          //Page Impressions
          if (p.name == 'page_impressions' && p.period == 'days_28') {
            let l = p['values'];
            this.pageImpressionsTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            }
          }

          //Page External Referrer
          if (p.name == 'page_views_external_referrals' && p.period == 'days_28') {
            let l = p['values'];
            this.externalReferrerList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            // }
          }
          //Page Unlike 
          if (p.name == 'page_fans_by_unlike_source_unique' && p.period == 'days_28') {
            let l = p['values'];
            this.pageUnlikeList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            // }
          }
          //Organic Reach
          if (p.name == 'page_impressions_organic' && p.period == 'days_28') {
            let l = p['values'];
            this.organicReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
            }
          }
          //Paid Reach
          if (p.name == 'page_impressions_paid' && p.period == 'days_28') {
            let l = p['values'];
            this.paidReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
            }
            this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
            this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
            this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
          }
          //Lost Likes
          if (p.name == 'page_fan_removes_unique' && p.period == 'days_28') {
            let l = p['values'];
            this.lostLikes = 0;
            for (let k = 0; k < l.length; k++) {
              this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
            }
          }
        }

      }
    }, error => {
      this.snackbarService.show('Fetch Data Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllDataOneDays() {
    debugger
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        for (let i = 0; i < res['data'].length; i++) {
          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique' && p.period == 'day') {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
          }
          //Clicks
          if (p.name == 'page_total_actions' && p.period == 'day') {
            let l = p['values'];
            this.pageClicksTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
            }
          }
          //positive feedback
          if (p.name == 'page_positive_feedback_by_type' && p.period == 'day') {
            let l = p['values'];
            this.positiveFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.positiveFeedback = parseInt(this.positiveFeedback) + parseInt(l[k].value['comment']);
              }
            }
          }
          //negative feedback
          if (p.name == 'page_negative_feedback' && p.period == 'day') {
            let l = p['values'];
            this.negativeFeedback = 0;
            for (let k = 0; k < l.length; k++) {
              if (l[k].value['other']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['other']);
              }
              if (l[k].value['like']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['like']);
              }
              if (l[k].value['comment']) {
                this.negativeFeedback = parseInt(this.negativeFeedback) + parseInt(l[k].value['comment']);
              }
            }
            this.totalfeedback = parseInt(this.positiveFeedback) + parseInt(this.negativeFeedback)
            this.percentPositive = this.getPercentage(parseInt(this.positiveFeedback), parseInt(this.totalfeedback));
            this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));
          }
          //Profile view count
          if (p.name == 'page_views_total' && p.period == 'day') {
            let l = p['values'];
            this.profileViewTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            }
            this.avgProfileView = this.getAverage(this.profileViewTotal, 28);
          }
          //Page Impressions
          if (p.name == 'page_impressions' && p.period == 'day') {
            let l = p['values'];
            this.pageImpressionsTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            }
          }

          //Page External Referrer
          if (p.name == 'page_views_external_referrals' && p.period == 'day') {
            let l = p['values'];
            this.externalReferrerList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            // }
          }
          //Page Unlike 
          if (p.name == 'page_fans_by_unlike_source_unique' && p.period == 'day') {
            let l = p['values'];
            this.pageUnlikeList = l;
            // for (let k = 0; k < l.length; k++) {
            //   this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            // }
          }
          //Organic Reach
          if (p.name == 'page_impressions_organic' && p.period == 'day') {
            let l = p['values'];
            this.organicReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
            }
          }
          //Paid Reach
          if (p.name == 'page_impressions_paid' && p.period == 'day') {
            let l = p['values'];
            this.paidReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
            }
            this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
            this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
            this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
          }
          //Lost Likes
          if (p.name == 'page_fan_removes_unique' && p.period == 'day') {
            let l = p['values'];
            this.lostLikes = 0;
            for (let k = 0; k < l.length; k++) {
              this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
            }
          }
        }

      }
    }, error => {
      this.snackbarService.show('Fetch Data Failed : ' + JSON.stringify(error.error));
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
        debugger
        this.avgProfileView = this.getAverage(this.profileViewTotal, 28);
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getPageImpression() {

    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {

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
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getPageReachOrganicCount() {
    //if this field name wrong then try for page_impressions_organic_unique
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_organic?access_token=" + this.pageToken;
    //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        let p = res['data'][2];
        let l = p['values'];
        this.organicReach = 0;
        for (let i = 0; i < l.length; i++) {
          this.organicReach = parseInt(this.organicReach) + parseInt(l[i].value)
        }
      }
    }, error => {
      this.snackbarService.show('Fetch Total Organic Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getPageReachPaidCount() {
    //if this field name wrong then try for page_impressions_paid_unique
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_paid?access_token=" + this.pageToken;
    //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        let p = res['data'][2];
        let l = p['values'];
        this.paidReach = 0;
        for (let i = 0; i < l.length; i++) {
          this.paidReach = parseInt(this.paidReach) + parseInt(l[i].value)
        }
        this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
        this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
        this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
      }
    }, error => {
      this.snackbarService.show('Fetch Total Paid Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getTotalClicksCount() {
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_total_actions?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
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
  getPageUnlikeBySOurceCount() {

    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_fans_by_unlike_source_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {

        let p = res['data'][2];
        let l = p['values'];
        // this.pageClicksTotal = 0;
        // for (let i = 0; i < l.length; i++) {
        //   this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[i].value)
        // }
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Clicks Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getTotalExternamReferrer() {
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_views_external_referrals?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        let p = res['data'][2];
        let l = p['values'];
        this.pageClicksTotal = 0;
        for (let i = 0; i < l.length; i++) {
          this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[i].value)
        }
      }
    }, error => {
      this.snackbarService.show('Fetch Total External Referrer Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getTotalLikesLost() {
    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_fan_removes_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
        let p = res['data'][2];
        let l = p['values'];
        this.lostLikes = 0;
        for (let i = 0; i < l.length; i++) {
          this.lostLikes = parseInt(this.lostLikes) + parseInt(l[i].value)
        }
        this.avgLostLikes = this.getAverage(this.lostLikes, 28);
      }
    }, error => {
      this.snackbarService.show('Fetch Total External Referrer Count Failed : ' + JSON.stringify(error.error));
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
        }

        this.totalfeedback = parseInt(this.positiveFeedback) + parseInt(this.negativeFeedback)
        this.percentPositive = this.getPercentage(parseInt(this.positiveFeedback), parseInt(this.totalfeedback));
        this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));

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
  getPercentage(num, total) {
    return ((100 * num) / total)
  }
  getAverage(count, totaldays) {
    let p = count / totaldays;
    if (p.toString().includes('0.')) {
      return '<1';
    } else {
      return p;
    }
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
