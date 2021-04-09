import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EMPTY, from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { positionElements } from 'ngx-bootstrap/positioning';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { CampaignService } from '../../campaign/campaign.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss']
})
export class SocialmediaComponent implements OnInit {
  selectedCampaignName: string;
  str = [];
  pageid;
  pagename;
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
  externalReferrerList = [];
  impressionByCountry = [];
  totalimpressionByCountry;
  totalimpressionByCountryPercent;
  totalimpressionByCountryCount;
  totalimpressionByCountryName;
  avgProfileView;
  avgNewLikes;
  avgPageClicks;
  avgLostLikes;
  avgPageImpression;
  avgPageReach;
  campaignList = [];
  selectedCampIdWebUrl: string;
  selectedCampId: string;
  toDate = new FormControl(new Date())
  fromDate = new FormControl(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000))
  tempDate = new Date();

  startDate;
  endDate;
  previousStartDate;
  previousEndDate;
  unixstartDate;
  unixendDate;
  unixpreviousStartDate;
  unixpreviousEndDate;
  clicksThisYear: string 
  myForm = new FormGroup({
    fromDate: this.fromDate,
    toDate: this.toDate,
  });
   constructor(private http: HttpClient, private snackbarService: SnackbarService, public datepipe: DatePipe, private fb: FacebookService, public router: Router,
    private campaignService: CampaignService, public openIdConnectService: OpenIdConnectService, public route: ActivatedRoute) {
    fb.init({
      appId: '200487178533939',//environment.facebook_appid,//3574916862576976
      version: 'v9.0'
    });
    
    //let id = this.route.snapshot.paramMap.get('id');
    let id = localStorage.getItem("selectedCampId");
    this.pagename = localStorage.getItem("facebookpagename");
    this.accessToken = localStorage.getItem("facebookaccesstoken");
    this.selectedCampaignName = this.pagename  !== "" ? this.pagename  : undefined;
    this.selectedCampId = `${id}`;
    //this.getCampaignList();
  }
  // using to get list of campaigns
  public getCampaignList(): void {

    var userid = localStorage.getItem("userID");
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      // this.source = new LocalDataSource(this.campaignList)
      var name = "";
      if (this.selectedCampId == ":id") {
        this.selectedCampId = this.campaignList[0].id
      }

      this.campaignList.map((s, i) => {
        if (s.id == this.selectedCampId) {
          name = s.name
          this.selectedCampIdWebUrl = s.webUrl
        }
      })
      this.selectedCampaignName = name !== "" ? name : undefined;
    });
  }

  // using to navigate to overview page to view anlytics of selected campaign
  public onCampaignSelect(event, selectedCampaign) {
    this.selectedCampaignName = selectedCampaign.name
    this.selectedCampId = selectedCampaign.id
    //this.router.navigate(['/home/overview', { id: this.selectedCampId }]);
    this.router.navigate(['./gsc/gsc', { id: this.selectedCampId }]);

  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  convertDateToUnixTimeStamp(date){
    //   let p = (new Date('2021-04-01')).getTime() / 1000;
   let p = (new Date(date)).getTime() / 1000;
   return p;
  }
 
  ngOnInit(): void {
    //https://graph.facebook.com/v2.6/pagename/insights/page_fans_country/lifetime?&since=yyy-mm-dd&until=yyyy-mm-dd&access_token=xxx
    //1502045853440674/insights/page_impressions_unique?since=1617148800&until=1617840000&period=day
    //106684034810637/insights/page_impressions_unique?since=1612154532&until=1617252132&period=lifetime
    this.pagename = localStorage.getItem('facebookpagename');
    this.accessToken = localStorage.getItem('facebookaccesstoken');
    //this.refreshToken();
    this.pageUnlikeList = [];// [{ "source": "1", "count": "2", "percent": "3" }, { "source": "4", "count": "5", "percent": "6" }];
    this.externalReferrerList = []// [{ "url": "1", "count": "2", "percent": "3" }, { "url": "4", "count": "5", "percent": "6" }];
  }
  onStartDateChange(event) {
    
    this.getDateDiff();
    this.getAllDataByDateChange();
  }
  onEndDateChange(event) {
    
    this.getDateDiff();
    this.getAllDataByDateChange();
  }
  calculateDateSlabDiff(start, end) {
    end = new Date(end);
    start = new Date(start);
    return Math.floor((Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) - Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())) / (1000 * 60 * 60 * 24));
  }
  getDateDiff() {
    this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
    let diff = this.calculateDateSlabDiff(this.toDate.value, this.fromDate.value);
    this.tempDate = new Date(this.startDate);
    this.previousEndDate = this.datepipe.transform(this.tempDate.setDate(this.tempDate.getDate() - 1), 'yyyy-MM-dd');
    this.tempDate = new Date(this.previousEndDate);
    this.previousStartDate = this.datepipe.transform(this.tempDate.setDate(this.tempDate.getDate() - diff), 'yyyy-MM-dd');
    this.unixstartDate = this.convertDateToUnixTimeStamp(this.startDate);
    this.unixendDate = this.convertDateToUnixTimeStamp(this.endDate);
    this.unixpreviousEndDate = this.convertDateToUnixTimeStamp(this.previousEndDate);
    this.unixpreviousStartDate = this.convertDateToUnixTimeStamp(this.previousStartDate);

  }
  refreshToken(){   
    const url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=200487178533939&client_secret=e2b6565db23b735aff9f7c5536dbb217&fb_exchange_token="+this.accessToken+"";
    this.http.get(url).subscribe(res => {
      if (res) {
        
        this.accessToken = res['access_token'];
        let facebookid =localStorage.getItem('facebookid');
        let masterid = localStorage.getItem('selectedCampId');
        let data = {
          id: facebookid,
          urlOrName: this.pagename,
          isActive: true,
          CampaignID: masterid,
          accessToken: this.accessToken,
          refreshToken:  '1111'
        }
        this.campaignService.updateFacebook(facebookid, data).subscribe(response => {
          
        });
        this.getUserId();
        this.getAllPagesList();
      }
    }, error => {
      alert('Fetch Refresh Token Failed : ' + JSON.stringify(error.error));
    });
  }
  getUserId() {
    
    const url = "https://graph.facebook.com/me?access_token=" + this.accessToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        
        this.userId = res['id'];
        this.userName = res['name'];
        //this.getUserPermission();
        // this.generatePageToken();

      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllPagesList() {
    
    const url = "https://graph.facebook.com/me/accounts?&access_token=" + this.accessToken;
    // const  url = "https://graph.facebook.com/" + this.userId + "/accounts?access_token=" + this.accessToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        
        let pagelist = res['data'];

        let currPage = pagelist.filter(x => x.name.toLowerCase() === this.selectedCampaignName.toLowerCase());
        this.pageToken = currPage[0].access_token;
        this.pageid = currPage[0].id;
        localStorage.setItem('FacebookPageToken', this.pageToken);
       // this.getAllDataByPeriod('days_28');
       this.getDateDiff();
       this.getAllDataByDateChange();
        //this. getPageLikes();
        //this.getPageNewLikes();
        //this.generatePageToken();
      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getUserPermission() {

    const url = "https://graph.facebook.com/" + this.userId + "/permissions?access_token=" + this.accessToken;
    // const url = "https://graph.facebook.com/105114094889635/accounts?access_token=EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD";
    this.http.get(url).subscribe(res => {
      if (res) {

        this.pageToken = res['data'][0].access_token;
        localStorage.setItem('FacebookPageToken', this.pageToken);
      }
    }, error => {
      this.snackbarService.show('Fetch Page Token Failed : ' + JSON.stringify(error.error));
    });
  }
  generatePageToken() {
    //  const url = "https://graph.facebook.com/{page-id}?fields=access_token&access_token=" + this.accessToken;

    const url = "https://graph.facebook.com/me/accounts?fields=name,access_token&access_token=" + this.accessToken;
    // const url = "https://graph.facebook.com/105114094889635/accounts?access_token=EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.pageToken = res['data'][0].access_token;
        localStorage.setItem('FacebookPageToken', this.pageToken);
        this.getAllDataByPeriod('days_28');
      }
    }, error => {
      this.snackbarService.show('Fetch Page Token Failed : ' + JSON.stringify(error.error));
    });
  }
  onSelect(period) {
    this.getAllDataByPeriod(period);
  }
  testDateSlab(){
    debugger
    let sdate = '2020-12-02'
    let edate = '2021-04-13'
    let tempdt;
    let diff = this.calculateDateSlabDiff(edate,sdate);
    if(diff > 93){
      tempdt =  this.datepipe.transform(this.tempDate.setDate(new Date(sdate).getDate() + 92), 'yyyy-MM-dd');
    }
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique,page_impressions_by_country_unique?access_token=" + this.pageToken+"&since="+sdate+"&until="+edate;
    this.http.get(url).subscribe(res => {
      if (res) { 
debugger
      }

    }, error => {
      this.snackbarService.show('Fetch Data Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllDataByDateChange() {
    
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique,page_impressions_by_country_unique?access_token=" + this.pageToken+"&since="+this.unixstartDate+"&until="+this.unixendDate;
    //const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique,page_impressions_by_country_unique?access_token=" + this.pageToken+"&since=1612154532&until=1617252132";
    this.http.get(url).subscribe(res => {
      
      let avgNum = 0;
      avgNum =  this.calculateDateSlabDiff(this.toDate.value, this.fromDate.value);
      if (res) {
        for (let i = 0; i < res['data'].length; i++) {

          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique') {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
          }
          //Clicks
          if (p.name == 'page_total_actions') {
            let l = p['values'];
            this.pageClicksTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
            }
            this.avgPageClicks = this.getAverage(this.pageClicksTotal, avgNum);
          } 
          
          //positive feedback
          if (p.name == 'page_positive_feedback_by_type') {
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
          if (p.name == 'page_negative_feedback') {
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
            if (this.percentPositive == 'NaN') { this.percentPositive = 0; }
            this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));
            if (this.percentNegative == 'NaN') { this.percentNegative = 0; }


          }
          //Profile view count
          if (p.name == 'page_views_total') {
            let l = p['values'];
            this.profileViewTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            }
            this.avgProfileView = this.getAverage(this.profileViewTotal, avgNum);
          }
          
          //Page Impressions
          if (p.name == 'page_impressions') {
            let l = p['values'];
            
            this.pageImpressionsTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            }
            this.avgPageImpression = this.getAverage(this.pageImpressionsTotal, avgNum);
          }

          //Page External Referrer

          if (p.name == 'page_views_external_referrals') {
            let l = p['values'];
            let str = l[1].value;

            this.externalReferrerList = [];
            if (str != undefined) {
              for (let i = 0; i < Object.keys(str).length; i++) {
                this.externalReferrerList.push({ 'url': Object.keys(str)[i], 'count': Object.values(str)[i], "percent": "0" });
              }
            }
            // for (let k = 0; k < l.length; k++) {
            //   this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            // }
          }
          //Page Unlike 
          if (p.name == 'page_fans_by_unlike_source_unique') {
            let l = p['values'];
            
            this.str = l[1].value;
            if (this.str != undefined || this.str.length != undefined) {
              let str = l[1].value;
              this.pageUnlikeList = [];
              if (str != undefined) {
                for (let i = 0; i < Object.keys(str).length; i++) {
                  this.pageUnlikeList.push({ 'url': Object.keys(str)[i], 'count': Object.values(str)[i], "percent": "0" });
                }
              }
            }
            // for (let k = 0; k < l.length; k++) {
            //   this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            // }
          }
          //Organic Reach
          if (p.name == 'page_impressions_organic') {
            let l = p['values'];
            this.organicReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
            }
          }
          
          //Paid Reach
          if (p.name == 'page_impressions_paid') {
            let l = p['values'];
            
            this.paidReach = 0;
            for (let k = 0; k < l.length; k++) {
              this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
            }
            this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
            this.avgPageReach = this.getAverage(this.pageReachTotal, avgNum);
            this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
            this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
          }
          //Lost Likes
          if (p.name == 'page_fan_removes_unique') {
            let l = p['values'];
            this.lostLikes = 0;
            for (let k = 0; k < l.length; k++) {
              this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
            }
            this.avgLostLikes = this.getAverage(this.lostLikes, avgNum);
          }
          //page_impressions_by_country_unique
          if (p.name == 'page_impressions_by_country_unique') {
            let l = p['values'];
            let str = l[0].value;
            this.str = l[0].value;
            if (Object.keys(str).length != undefined) {
              this.impressionByCountry = [];
              this.totalimpressionByCountry = "0";
              
              if (str != undefined) {
                for (let i = 0; i < Object.keys(str).length; i++) {
                  this.impressionByCountry.push({ 'country': Object.keys(str)[i], 'count': Object.values(str)[i], "percent": "0" });
                  this.totalimpressionByCountry = parseInt(this.totalimpressionByCountry) + parseInt(Object.values(str)[i].toString());
                }
                this.impressionByCountry.sort((a, b) => (a.count > b.count ? -1 : 1));
                this.totalimpressionByCountryName = this.impressionByCountry[0].country;
                this.totalimpressionByCountryCount = this.impressionByCountry[0].count;
                this.totalimpressionByCountryPercent = this.getPercentage(this.impressionByCountry[0].count, this.totalimpressionByCountry)
               // this.totalimpressionByCountryPercent = parseFloat(this.totalimpressionByCountryPercent.toString()).toFixed(2)
              }
            }
          }
        }
      }



    }, error => {
      this.snackbarService.show('Fetch Data Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllDataByPeriod(period) {

    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique,page_impressions_by_country_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      let avgNum = 0;
      if(period == 'days_28'){avgNum= 28;}
      if(period == 'week'){avgNum= 7;}
      if(period == 'day'){avgNum= 1;}
      if (res) {
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
            this.avgPageClicks = this.getAverage(this.pageClicksTotal, avgNum);
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
            if (this.percentPositive == 'NaN') { this.percentPositive = 0; }
            this.percentNegative = this.getPercentage(parseInt(this.negativeFeedback), parseInt(this.totalfeedback));
            if (this.percentNegative == 'NaN') { this.percentNegative = 0; }


          }
          //Profile view count
          if (p.name == 'page_views_total' && p.period == period) {
            let l = p['values'];
            this.profileViewTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            }
            this.avgProfileView = this.getAverage(this.profileViewTotal, avgNum);
          }
          //Page Impressions
          if (p.name == 'page_impressions' && p.period == period) {
            let l = p['values'];
            this.pageImpressionsTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
            }
            
            this.avgPageImpression = this.getAverage(this.pageImpressionsTotal, avgNum);
          }

          //Page External Referrer

          if (p.name == 'page_views_external_referrals') {
            let l = p['values'];
            let str = l[1].value;

            this.externalReferrerList = [];
            if (str != undefined) {
              for (let i = 0; i < Object.keys(str).length; i++) {
                this.externalReferrerList.push({ 'url': Object.keys(str)[i], 'count': Object.values(str)[i], "percent": "0" });
              }
            }
            // for (let k = 0; k < l.length; k++) {
            //   this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
            // }
          }
          //Page Unlike 
          if (p.name == 'page_fans_by_unlike_source_unique') {
            let l = p['values'];
            
            this.str = l[1].value;
            if (this.str != undefined || this.str.length != undefined) {
              let str = l[1].value;
              this.pageUnlikeList = [];
              if (str != undefined) {
                for (let i = 0; i < Object.keys(str).length; i++) {
                  this.pageUnlikeList.push({ 'url': Object.keys(str)[i], 'count': Object.values(str)[i], "percent": "0" });
                }
              }
            }
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
            this.avgPageReach = this.getAverage(this.pageReachTotal, avgNum);
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
            this.avgLostLikes = this.getAverage(this.lostLikes, avgNum);
          }
          //page_impressions_by_country_unique
          if (p.name == 'page_impressions_by_country_unique') {
            let l = p['values'];
            let str = l[0].value;
            this.str = l[0].value;
            if (Object.keys(str).length != undefined) {
              this.impressionByCountry = [];
              this.totalimpressionByCountry = "0";
              
              if (str != undefined) {
                for (let i = 0; i < Object.keys(str).length; i++) {
                  this.impressionByCountry.push({ 'country': Object.keys(str)[i], 'count': Object.values(str)[i], "percent": "0" });
                  this.totalimpressionByCountry = parseInt(this.totalimpressionByCountry) + parseInt(Object.values(str)[i].toString());
                }
                this.impressionByCountry.sort((a, b) => (a.count > b.count ? -1 : 1));
                this.totalimpressionByCountryName = this.impressionByCountry[0].country;
                this.totalimpressionByCountryCount = this.impressionByCountry[0].count;
                this.totalimpressionByCountryPercent = this.getPercentage(this.impressionByCountry[0].count, this.totalimpressionByCountry)
               // this.totalimpressionByCountryPercent = parseFloat(this.totalimpressionByCountryPercent.toString()).toFixed(2)
              }
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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_views_total?access_token=" + this.pageToken;
    //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
    this.http.get(url).subscribe(res => {
      if (res) {
        let p = res['data'][2];
        let l = p['values'];
        this.profileViewTotal = 0;
        for (let i = 0; i < l.length; i++) {
          this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[i].value)
        }

        this.avgProfileView = this.getAverage(this.profileViewTotal, 28);
      }
    }, error => {
      this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  // getPageImpression() {

  //   const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions?access_token=" + this.pageToken;
  //   this.http.get(url).subscribe(res => {
  //     if (res) {

  //       let p = res['data'][2];
  //       let l = p['values'];
  //       this.pageImpressionsTotal = 0;
  //       for (let i = 0; i < l.length; i++) {
  //         this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[i].value)
  //       }
  //     }
  //   }, error => {
  //     this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
  //   });
  // }
  // getPageReachCount() {
  //   //page_views_unique Page Views from users logged into Facebook day
  //   const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique?access_token=" + this.pageToken;
  //   //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
  //   this.http.get(url).subscribe(res => {
  //     if (res) {
  //       let p = res['data'][2];
  //       let l = p['values'];
  //       this.pageReachTotal = 0;
  //       for (let i = 0; i < l.length; i++) {
  //         this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[i].value)
  //       }
  //     }
  //   }, error => {
  //     this.snackbarService.show('Fetch Total Page Reach Count Failed : ' + JSON.stringify(error.error));
  //   });
  // }
  getPageReachOrganicCount() {
    //if this field name wrong then try for page_impressions_organic_unique
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_organic?access_token=" + this.pageToken;
    //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
    this.http.get(url).subscribe(res => {
      if (res) {

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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_paid?access_token=" + this.pageToken;
    //const url = "https://graph.facebook.com/102988865108273/insights/page_impressions_unique?access_token=EAAGXn3oGklwBAAni75mymZAVNH0RB7ecJ7BSj6lYmnRwWewDSJMvhUZCxwMlnPH1HnMHWYKccrsDR6dyjeeQPBDpucGeN6EtvYTYcZC1OeWa2ObRAlHS2ZC2yMMmOLB5AkJWuxK0YtLBv2EpaD2RtsEjeb8EgbPUUeJLkDnbG4jplrccWCKgzu8LU4ie0abbeBrdzscvuATZCusuSOXku";
    this.http.get(url).subscribe(res => {
      if (res) {

        let p = res['data'][2];
        let l = p['values'];
        this.paidReach = 0;
        for (let i = 0; i < l.length; i++) {
          this.paidReach = parseInt(this.paidReach) + parseInt(l[i].value)
        }
        this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
        this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
        this.percentOrganicReach = parseFloat(this.percentOrganicReach.toString()).toFixed(0);
        this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
        this.percentPaidReach = parseFloat(this.percentPaidReach.toString()).toFixed(0);
      }
    }, error => {
      this.snackbarService.show('Fetch Total Paid Page Reach Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getTotalClicksCount() {
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_total_actions?access_token=" + this.pageToken;
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
  getPageUnlikeBySOurceCount() {

    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_fans_by_unlike_source_unique?access_token=" + this.pageToken;
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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_views_external_referrals?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {

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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_fan_removes_unique?access_token=" + this.pageToken;
    this.http.get(url).subscribe(res => {
      if (res) {

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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_positive_feedback_by_type?access_token=" + this.pageToken;
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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_negative_feedback?access_token=" + this.pageToken;
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
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique?access_token=" + this.accessToken;

    this.http.get(url).subscribe(res => {
      if (res) {

        this.profileViewTotal = res['page_views_unique'];
      }
    }, error => {
      this.snackbarService.show('Fetch Total Profile View Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getPercentage(num, total) {
    let p = ((100 * num) / total);
    return parseFloat(p.toString()).toFixed(0);
  }
  getAverage(count, totaldays) {
    let p = count / totaldays;
    if (p.toString().includes('0.')) {
      return '<1';
    } else {
      return parseInt(p.toString()).toFixed(0);
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
