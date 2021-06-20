import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { positionElements } from 'ngx-bootstrap/positioning';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { CampaignService } from '../../campaign/campaign.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { differenceBy } from 'lodash';
import { ReturnStatement } from '@angular/compiler';
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
  //Profile View
  profileViewTotal;
  profileViewTotalPrev;
  avgProfileView;
  percentProfileView
  //Page Clicks
  pageClicksTotal;
  avgPageClicks;
  pageClicksPrev;
  percentPageClicks;
  //Lost Likes
  lostLikes;
  avgLostLikes;
  lostLikesPrev;
  percentlostLikes;
  //New Likes
  pagelikesTotal;
  pagelikesTotalPrev;
  avgNewlikes;
  pageNewlikesTotal
  pageNewlikesTotalPrev;
  percentpageNewlikes;
  //Page Impression
  pageImpressionsTotal;
  avgPageImpression;
  pageImpressionsTotalPrev;
  percentpageImpressions;
  //Page Reach
  pageReachFullTotal;
  pageReachTotal;
  avgPageReach;
  percentPageReach;
  pageReachTotalPrev;
  organicReach;
  organicReachPrev;
  percentOrganicReach;
  paidReach;
  paidReachPrev;
  percentPaidReach;






  pageToken;
  userId;
  userName;

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


  topCountry;
  topReferrer;
  pageUnlikeList;
  externalReferrerList = [];
  impressionByCountry = [];
  totalimpressionByCountry;
  totalimpressionByCountryPercent;
  totalimpressionByCountryCount;
  totalimpressionByCountryName;


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
  //CComprision Variables
  ProfileVie
  myForm = new FormGroup({
    fromDate: this.fromDate,
    toDate: this.toDate,
  });
  settingActive;
  constructor(private http: HttpClient, private snackbarService: SnackbarService, public datepipe: DatePipe, public router: Router,
    private campaignService: CampaignService, public openIdConnectService: OpenIdConnectService, public route: ActivatedRoute) {
    //let id = this.route.snapshot.paramMap.get('id');
    let id = localStorage.getItem("selectedCampId");
    this.pagename = localStorage.getItem("facebookpagename");
    this.accessToken = localStorage.getItem("facebookaccesstoken");
    this.selectedCampaignName = this.pagename !== "" ? this.pagename : undefined;
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
  convertDateToUnixTimeStamp(date) {
    //   let p = (new Date('2021-04-01')).getTime() / 1000;
    let p = (new Date(date)).getTime() / 1000;
    return p;
  }

  ngOnInit(): void {
    this.resetVariables();
    this.pagename = localStorage.getItem('facebookpagename');
    this.accessToken = localStorage.getItem('facebookaccesstoken');
    this.refreshToken();
    this.pageUnlikeList = [];// [{ "source": "1", "count": "2", "percent": "3" }, { "source": "4", "count": "5", "percent": "6" }];
    this.externalReferrerList = []// [{ "url": "1", "count": "2", "percent": "3" }, { "url": "4", "count": "5", "percent": "6" }];
  }
  onStartDateChange(event) {
    this.resetVariables();
    // this.getDateDiff();
    this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
    this.testDateSlab(this.startDate, this.endDate, 0)
    //  this.testDateSlab(this.previousStartDate, this.previousEndDate, 1)
    // this.getAllDataByDateChange();
  }
  onEndDateChange(event) {
    //this.getDateDiff();
    this.resetVariables();
    this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
    this.testDateSlab(this.startDate, this.endDate, 0)
    // this.testDateSlab(this.startDate, this.endDate, 0)
    // this.testDateSlab(this.previousStartDate, this.previousEndDate, 1)
    // this.getAllDataByDateChange();
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

  refreshToken() {
    //const url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id="+environment.facebook_appid+"&client_secret="+environment.facebook_appSecret+"&fb_exchange_token=" + this.accessToken + "";
    const url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=200487178533939&client_secret=e2b6565db23b735aff9f7c5536dbb217&fb_exchange_token=" + this.accessToken + "";
    this.http.get(url).subscribe(res => {
      if (res) {

        this.accessToken = res['access_token'];
        let facebookid = localStorage.getItem('facebookid');
        let masterid = localStorage.getItem('selectedCampId');
        let data = {
          id: facebookid,
          urlOrName: this.pagename,
          isActive: true,
          CampaignID: masterid,
          accessToken: this.accessToken,
          refreshToken: '1111'
        }
        this.campaignService.updateFacebook(facebookid, data).subscribe(response => {

        });
        this.getAllPagesList();
      }
    }, error => {
      alert('Fetch Refresh Token Failed : ' + JSON.stringify(error.error));
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
        this.getDateDiff();
        this.testDateSlab(this.startDate, this.endDate, 0)

        //this.testDateSlab(this.previousStartDate, this.previousEndDate, 1)
        //this.getPageLikes(this.startDate, this.endDate);
        //this.getPageNewLikes(this.startDate, this.endDate, 0);
        //this.getPageNewLikes(this.startDate, this.endDate, 1);

        //this.generatePageToken();
      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }

  testDateSlab(sdate, edate, isPrev) {
    //   sdate = "2020-9-02";
    // edate = "2021-04-13";
    const multiPuts = [];
    const multiPutsNewLikes = [];
    const multiPutsPageLikes = [];
    let tempsdt;
    let tempedt;
    let d = 0;
    let tempDiff = 0;
    let diff = this.calculateDateSlabDiff(edate, sdate);
    if (diff > 93) {
      d = diff / 93;
      if (d > 0) {
        d = Math.floor(d);
        for (let i = 0; i <= d; i++) {
          if (i == 0) {
            tempsdt = sdate;
            tempedt = this.datepipe.transform(new Date(sdate).setDate(new Date(sdate).getDate() + 93), "yyyy-MM-dd");
            tempDiff = diff - 93;
            multiPuts.push(this.callFaceBookApi1(tempsdt, tempedt, 'all'));
            multiPutsNewLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'newlikes'));
            multiPutsPageLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'pagelikes'));

            //this.callFaceBookApi(tempsdt, tempedt, isPrev);
          }
          else {
            tempsdt = this.datepipe.transform(new Date(tempedt).setDate(new Date(tempedt).getDate() - 1), "yyyy-MM-dd");
            if (tempDiff >= 93) {
              tempedt = this.datepipe.transform(new Date(tempedt).setDate(new Date(tempedt).getDate() + 92), "yyyy-MM-dd");
              tempDiff = tempDiff - 93;
            } else {
              tempedt = this.datepipe.transform(new Date(tempedt).setDate(new Date(tempedt).getDate() + tempDiff), "yyyy-MM-dd");
            }
            multiPuts.push(this.callFaceBookApi1(tempsdt, tempedt, 'all'));
            multiPutsNewLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'newlikes'));
            multiPutsPageLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'pagelikes'));


            //this.callFaceBookApi(tempsdt, tempedt, isPrev);
          }
        }
      }
    }
    else {
      multiPuts.push(this.callFaceBookApi1(sdate, edate, 'all'));
      multiPutsNewLikes.push(this.callFaceBookApi1(sdate, edate, 'newlikes'));
      multiPutsPageLikes.push(this.callFaceBookApi1(sdate, edate, 'pagelikes'));
      //  this.callFaceBookApi(sdate, edate, isPrev);
    }
    forkJoin(...multiPuts).subscribe(
      data => { // Note: data is an array now
        for (let i = 0; i < data.length; i++) {
          this.CalculateThisSlab(data[i].data, 0);
        }
        this.testDateSlabPrev(this.previousStartDate, this.previousEndDate);
        //this.CalculateThisSlab()
      }, err => console.log('error ' + err),
      () => console.log('Ok ')
    );
    forkJoin(...multiPutsNewLikes).subscribe(
      data => { // Note: data is an array now

        this.CalculatePageNewLikes(data[0], 0);
      }, err => console.log('error ' + err),
      () => console.log('Ok ')
    );
    forkJoin(...multiPutsPageLikes).subscribe(
      data => { // Note: data is an array now

        this.CalculatePageLikes(data[0], 0);
      }, err => console.log('error ' + err),
      () => console.log('Ok ')
    );
  }
  testDateSlabPrev(sdate, edate) {

    //   sdate = "2020-9-02";
    // edate = "2021-04-13";
    const multiPuts = [];
    const multiPutsNewLikes = [];
    const multiPutsPageLikes = [];
    let tempsdt;
    let tempedt;
    let d = 0;
    let tempDiff = 0;
    let diff = this.calculateDateSlabDiff(edate, sdate);
    if (diff > 93) {
      d = diff / 93;
      if (d > 0) {
        d = Math.floor(d);
        for (let i = 0; i <= d; i++) {
          if (i == 0) {
            tempsdt = sdate;
            tempedt = this.datepipe.transform(new Date(sdate).setDate(new Date(sdate).getDate() + 93), "yyyy-MM-dd");
            tempDiff = diff - 93;
            multiPuts.push(this.callFaceBookApi1(tempsdt, tempedt, 'all'));
            multiPutsNewLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'newlikes'));
            multiPutsPageLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'pagelikes'));

            //this.callFaceBookApi(tempsdt, tempedt, isPrev);
          }
          else {
            tempsdt = this.datepipe.transform(new Date(tempedt).setDate(new Date(tempedt).getDate() - 1), "yyyy-MM-dd");
            if (tempDiff >= 93) {
              tempedt = this.datepipe.transform(new Date(tempedt).setDate(new Date(tempedt).getDate() + 92), "yyyy-MM-dd");
              tempDiff = tempDiff - 93;
            } else {
              tempedt = this.datepipe.transform(new Date(tempedt).setDate(new Date(tempedt).getDate() + tempDiff), "yyyy-MM-dd");
            }
            multiPuts.push(this.callFaceBookApi1(tempsdt, tempedt, 'all'));
            multiPutsNewLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'newlikes'));
            multiPutsPageLikes.push(this.callFaceBookApi1(tempsdt, tempedt, 'pagelikes'));
            //this.callFaceBookApi(tempsdt, tempedt, isPrev);
          }
        }
      }
    }
    else {
      multiPuts.push(this.callFaceBookApi1(sdate, edate, 'all'));
      multiPutsNewLikes.push(this.callFaceBookApi1(sdate, edate, 'newlikes'));
      multiPutsPageLikes.push(this.callFaceBookApi1(sdate, edate, 'pagelikes'));
      //  this.callFaceBookApi(sdate, edate, isPrev);
    }
    forkJoin(...multiPuts).subscribe(
      data => { // Note: data is an array now
        for (let i = 0; i < data.length; i++) {
          this.CalculateThisSlab(data[i].data, 1);
        }
        //this.CalculateThisSlab()
      }, err => console.log('error ' + err),
      () => console.log('Ok ')
    );
    forkJoin(...multiPutsNewLikes).subscribe(
      data => { // Note: data is an array now

        this.CalculatePageNewLikes(data[0], 1);
      }, err => console.log('error ' + err),
      () => console.log('Ok ')
    );
    // forkJoin(...multiPutsPageLikes).subscribe(
    //   data => { // Note: data is an array now
    //
    //     this.CalculatePageLikes(data[0], 0);
    //   }, err => console.log('error ' + err),
    //   () => console.log('Ok ')
    // );
  }

  callFaceBookApi1(sdt, edt, type) {

    let url;
    if (type == 'all') {
      url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique,page_impressions_by_country_unique?access_token=" + this.pageToken + "&since=" + sdt + "&until=" + edt + "&period=day";
    }
    if (type == 'newlikes') {
      url = "https://graph.facebook.com/" + this.pageid + "?access_token=" + this.pageToken + "&fields=new_like_count&since=" + sdt + "&until=" + edt + "&period=day";
    }
    if (type == 'pagelikes') {
      url = "https://graph.facebook.com/" + this.pageid + "?access_token=" + this.pageToken + "&fields=country_page_likes&since=" + sdt + "&until=" + edt + "&period=day";
    }
    return this.http.get<any>(url);

  }

  resetVariables() {
    this.pageReachTotal = 0;
    this.pageClicksTotal = 0;
    this.positiveFeedback = 0;
    this.negativeFeedback = 0;
    this.profileViewTotal = 0;
    this.pageImpressionsTotal = 0;
    this.externalReferrerList = [];
    this.pageUnlikeList = [];
    this.organicReach = 0;
    this.paidReach = 0;
    this.lostLikes = 0;
    this.lostLikesPrev = 0;
    this.impressionByCountry = [];
    this.totalimpressionByCountry = "0";
    this.profileViewTotalPrev = 0;
    this.pageClicksPrev = 0;
    this.pageImpressionsTotalPrev = 0;
    this.percentpageImpressions = 0;
    this.pageReachTotal = 0;
    this.organicReach = 0;
    this.organicReachPrev = 0;
    this.percentOrganicReach = 0;
    this.paidReach = 0;
    this.paidReachPrev = 0;
    this.percentPaidReach = 0;
    this.pageReachTotalPrev = 0;
    this.percentpageNewlikes = 0;
  }
  CalculateThisSlab(res, isPrev) {

    let avgNum = 0;
    avgNum = this.calculateDateSlabDiff(this.toDate.value, this.fromDate.value);
    for (let i = 0; i < res.length; i++) {

      let p = res[i];
      //Page Reach
      if (p.name == 'page_impressions_unique') {
        let l = p['values'];
        // this.pageReachTotal = 0;
        for (let k = 0; k < l.length; k++) {
          this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
        }
      }
      //Clicks
      if (p.name == 'page_total_actions') {
        let l = p['values'];
        //  this.pageClicksTotal = 0;
        if (isPrev == 0) {
          for (let k = 0; k < l.length; k++) {
            this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
          }
          this.avgPageClicks = this.getAverage(this.pageClicksTotal, avgNum);
        }
        if (isPrev == 1) {

          for (let k = 0; k < l.length; k++) {
            this.pageClicksPrev = parseInt(this.pageClicksPrev) + parseInt(l[k].value)
          }
          let diff = this.pageClicksTotal - this.pageClicksPrev;
          this.percentPageClicks = this.getPercentageChange(this.pageClicksPrev, this.pageClicksTotal);
          if (diff < 0) {
            this.percentPageClicks = this.pos_to_neg(this.percentPageClicks).toFixed(2);
          }
        }
      }

      //positive feedback
      if (p.name == 'page_positive_feedback_by_type') {
        let l = p['values'];
        // this.positiveFeedback = 0;
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
        //this.negativeFeedback = 0;
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
        // this.profileViewTotal = 0;
        if (isPrev == 0) {
          for (let k = 0; k < l.length; k++) {
            this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
          }
          this.avgProfileView = this.getAverage(this.profileViewTotal, avgNum);
        }
        if (isPrev == 1) {

          for (let k = 0; k < l.length; k++) {
            this.profileViewTotalPrev = parseInt(this.profileViewTotalPrev) + parseInt(l[k].value)
          }
          let diff = this.profileViewTotal - this.profileViewTotalPrev;
          this.percentProfileView = this.getPercentageChange(this.profileViewTotalPrev, this.profileViewTotal);
          if (diff < 0) {
            this.percentProfileView = this.pos_to_neg(this.percentProfileView).toFixed(2);
          }
        }
      }

      //Page Impressions
      if (p.name == 'page_impressions') {
        let l = p['values'];

        // this.pageImpressionsTotal = 0;
        if (isPrev == 0) {
          for (let k = 0; k < l.length; k++) {
            this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
          }
          this.avgPageImpression = this.getAverage(this.pageImpressionsTotal, avgNum);
        }
        if (isPrev == 1) {
          for (let k = 0; k < l.length; k++) {
            this.pageImpressionsTotalPrev = parseInt(this.pageImpressionsTotalPrev) + parseInt(l[k].value)
          }
          let diff = this.profileViewTotal - this.pageImpressionsTotalPrev;
          this.percentpageImpressions = this.getPercentageChange(this.pageImpressionsTotalPrev, this.pageImpressionsTotal);
          if (diff < 0) {
            this.percentpageImpressions = this.pos_to_neg(this.percentpageImpressions).toFixed(2);
          }
        }
      }

      //Page External Referrer

      if (p.name == 'page_views_external_referrals') {
        let l = p['values'];
        let str = l[1].value;

        //this.externalReferrerList = [];
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
          // this.pageUnlikeList = [];
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
        //this.organicReach = 0;
        if (isPrev == 0) {
          for (let k = 0; k < l.length; k++) {
            this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
          }
        }
        if (isPrev == 1) {
          for (let k = 0; k < l.length; k++) {
            this.organicReachPrev = parseInt(this.organicReachPrev) + parseInt(l[k].value)
          }
        }
      }

      //Paid Reach
      if (p.name == 'page_impressions_paid') {
        let l = p['values'];

        //this.paidReach = 0;
        if (isPrev == 0) {
          for (let k = 0; k < l.length; k++) {
            this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
          }
          this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
        }
        if (isPrev == 1) {
          for (let k = 0; k < l.length; k++) {
            this.paidReachPrev = parseInt(this.paidReachPrev) + parseInt(l[k].value)
          }

          this.pageReachTotalPrev = parseInt(this.paidReachPrev) + parseInt(this.organicReachPrev)
          this.pageReachFullTotal = this.pageReachTotal + this.pageReachTotalPrev;
          let diff = this.pageReachTotal - this.pageReachTotalPrev;
          this.percentPageReach = this.getPercentageChange(this.pageReachTotalPrev, this.pageReachTotal);
          if (diff < 0) {
            this.percentPageReach = this.pos_to_neg(this.percentPageReach).toFixed(2);
          }

        }
        this.avgPageReach = this.getAverage(this.pageReachFullTotal, avgNum);
        this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
        this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
      }
      //Lost Likes
      if (p.name == 'page_fan_removes_unique') {

        let l = p['values'];
        // this.lostLikes = 0;
        if (isPrev == 0) {
          for (let k = 0; k < l.length; k++) {
            this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
          }
          this.avgLostLikes = this.getAverage(this.lostLikes, avgNum);
        }
        if (isPrev == 1) {
          for (let k = 0; k < l.length; k++) {
            this.lostLikesPrev = parseInt(this.lostLikesPrev) + parseInt(l[k].value)
          }
          let diff = this.lostLikes - this.lostLikesPrev;

          this.percentlostLikes = this.getPercentageChange(this.lostLikesPrev, this.lostLikes);
          if (diff < 0) {
            this.percentlostLikes = this.pos_to_neg(this.percentlostLikes).toFixed(2);
          }
        }
      }
      //page_impressions_by_country_unique
      if (p.name == 'page_impressions_by_country_unique') {
        let l = p['values'];
        let str = l[0].value;
        this.str = l[0].value;
        if (Object.keys(str).length != undefined) {
          // this.impressionByCountry = [];
          // this.totalimpressionByCountry = "0";

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
  CalculatePageNewLikes(res, isPrev) {

    let avgNum = 0;
    avgNum = this.calculateDateSlabDiff(this.toDate.value, this.fromDate.value);
    if (isPrev == 0) {
      this.pageNewlikesTotal = res['new_like_count'];
      this.avgNewlikes = this.getAverage(this.pageNewlikesTotal, avgNum);
    }
    if (isPrev == 1) {
      this.pageNewlikesTotalPrev = res['new_like_count'];

      let diff = this.pageNewlikesTotal - this.pageNewlikesTotalPrev;
      this.percentpageNewlikes = this.getPercentageChange(this.pageNewlikesTotalPrev, this.pageNewlikesTotal);
      if (diff < 0) {
        this.percentpageNewlikes = this.pos_to_neg(this.percentpageNewlikes).toFixed(2);
      }
    }

  }
  CalculatePageLikes(res, isPrev) {
    this.pagelikesTotal = res['country_page_likes'];
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
  getPercentageChange(oldNumber, newNumber) {
    if (oldNumber == 0 && newNumber == 0) {
      return 0;
    } else
      if (oldNumber == 0 && newNumber > 0) {
        return 100;
      }
      else {
        var decreaseValue = oldNumber - newNumber;
        return ((decreaseValue / oldNumber) * 100).toFixed(2);
      }
  }
  pos_to_neg(num) {
    return -Math.abs(num);
  }
  callFaceBookApi(sdt, edt, isPrev) {
    let avgNum = 0;
    delay(5000);
    avgNum = this.calculateDateSlabDiff(this.toDate.value, this.fromDate.value);
    const url = "https://graph.facebook.com/" + this.pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique,page_impressions_by_country_unique?access_token=" + this.pageToken + "&since=" + sdt + "&until=" + edt + "&period=day";
    this.http.get(url).subscribe(res => {
      if (res) {
        delay(10000);
        for (let i = 0; i < res['data'].length; i++) {

          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique') {
            let l = p['values'];
            // this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
          }
          //Clicks
          if (p.name == 'page_total_actions') {
            let l = p['values'];
            //  this.pageClicksTotal = 0;
            if (isPrev == 0) {
              for (let k = 0; k < l.length; k++) {
                this.pageClicksTotal = parseInt(this.pageClicksTotal) + parseInt(l[k].value)
              }
              this.avgPageClicks = this.getAverage(this.pageClicksTotal, avgNum);
            }
            if (isPrev == 1) {

              for (let k = 0; k < l.length; k++) {
                this.pageClicksPrev = parseInt(this.pageClicksPrev) + parseInt(l[k].value)
              }
              let diff = this.pageClicksTotal - this.pageClicksPrev;
              this.percentPageClicks = this.getPercentageChange(this.pageClicksPrev, this.pageClicksTotal);
              if (diff < 0) {
                this.percentPageClicks = this.pos_to_neg(this.percentPageClicks).toFixed(2);
              }
            }
          }

          //positive feedback
          if (p.name == 'page_positive_feedback_by_type') {
            let l = p['values'];
            // this.positiveFeedback = 0;
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
            //this.negativeFeedback = 0;
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
            // this.profileViewTotal = 0;
            if (isPrev == 0) {
              for (let k = 0; k < l.length; k++) {
                this.profileViewTotal = parseInt(this.profileViewTotal) + parseInt(l[k].value)
              }
              this.avgProfileView = this.getAverage(this.profileViewTotal, avgNum);
            }
            if (isPrev == 1) {

              for (let k = 0; k < l.length; k++) {
                this.profileViewTotalPrev = parseInt(this.profileViewTotalPrev) + parseInt(l[k].value)
              }
              let diff = this.profileViewTotal - this.profileViewTotalPrev;
              this.percentProfileView = this.getPercentageChange(this.profileViewTotalPrev, this.profileViewTotal);
              if (diff < 0) {
                this.percentProfileView = this.pos_to_neg(this.percentProfileView).toFixed(2);
              }
            }
          }

          //Page Impressions
          if (p.name == 'page_impressions') {
            let l = p['values'];

            // this.pageImpressionsTotal = 0;
            if (isPrev == 0) {
              for (let k = 0; k < l.length; k++) {
                this.pageImpressionsTotal = parseInt(this.pageImpressionsTotal) + parseInt(l[k].value)
              }
              this.avgPageImpression = this.getAverage(this.pageImpressionsTotal, avgNum);
            }
            if (isPrev == 1) {
              for (let k = 0; k < l.length; k++) {
                this.pageImpressionsTotalPrev = parseInt(this.pageImpressionsTotalPrev) + parseInt(l[k].value)
              }
              let diff = this.profileViewTotal - this.pageImpressionsTotalPrev;
              this.percentpageImpressions = this.getPercentageChange(this.pageImpressionsTotalPrev, this.pageImpressionsTotal);
              if (diff < 0) {
                this.percentpageImpressions = this.pos_to_neg(this.percentpageImpressions).toFixed(2);
              }
            }
          }

          //Page External Referrer

          if (p.name == 'page_views_external_referrals') {
            let l = p['values'];
            let str = l[1].value;

            //this.externalReferrerList = [];
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
              // this.pageUnlikeList = [];
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
            //this.organicReach = 0;
            if (isPrev == 0) {
              for (let k = 0; k < l.length; k++) {
                this.organicReach = parseInt(this.organicReach) + parseInt(l[k].value)
              }
            }
            if (isPrev == 1) {
              for (let k = 0; k < l.length; k++) {
                this.organicReachPrev = parseInt(this.organicReachPrev) + parseInt(l[k].value)
              }
            }
          }

          //Paid Reach
          if (p.name == 'page_impressions_paid') {
            let l = p['values'];

            //this.paidReach = 0;
            if (isPrev == 0) {
              for (let k = 0; k < l.length; k++) {
                this.paidReach = parseInt(this.paidReach) + parseInt(l[k].value)
              }
              this.pageReachTotal = parseInt(this.paidReach) + parseInt(this.organicReach)
            }
            if (isPrev == 1) {
              for (let k = 0; k < l.length; k++) {
                this.paidReachPrev = parseInt(this.paidReachPrev) + parseInt(l[k].value)
              }

              this.pageReachTotalPrev = parseInt(this.paidReachPrev) + parseInt(this.organicReachPrev)
              this.pageReachFullTotal = this.pageReachTotal + this.pageReachTotalPrev;
              let diff = this.pageReachTotal - this.pageReachTotalPrev;
              this.percentPageReach = this.getPercentageChange(this.pageReachTotalPrev, this.pageReachTotal);
              if (diff < 0) {
                this.percentPageReach = this.pos_to_neg(this.percentPageReach).toFixed(2);
              }

            }
            this.avgPageReach = this.getAverage(this.pageReachFullTotal, avgNum);
            this.percentOrganicReach = this.getPercentage(parseInt(this.organicReach), parseInt(this.pageReachTotal));
            this.percentPaidReach = this.getPercentage(parseInt(this.paidReach), parseInt(this.pageReachTotal));
          }
          //Lost Likes
          if (p.name == 'page_fan_removes_unique') {
            let l = p['values'];
            // this.lostLikes = 0;
            if (isPrev == 0) {
              for (let k = 0; k < l.length; k++) {
                this.lostLikes = parseInt(this.lostLikes) + parseInt(l[k].value)
              }
              this.avgLostLikes = this.getAverage(this.lostLikes, avgNum);
            }
            if (isPrev == 1) {

              for (let k = 0; k < l.length; k++) {
                this.lostLikesPrev = parseInt(this.lostLikesPrev) + parseInt(l[k].value)
              }
              let diff = this.lostLikes - this.lostLikesPrev;
              this.percentlostLikes = this.getPercentageChange(this.lostLikesPrev, this.lostLikes);
              if (diff < 0) {
                this.percentlostLikes = this.pos_to_neg(this.percentlostLikes).toFixed(2);
              }
            }
          }
          //page_impressions_by_country_unique
          if (p.name == 'page_impressions_by_country_unique') {
            let l = p['values'];
            let str = l[0].value;
            this.str = l[0].value;
            if (Object.keys(str).length != undefined) {
              // this.impressionByCountry = [];
              // this.totalimpressionByCountry = "0";

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

  getPageNewLikes(sdt, edt, isPrev) {

    const url = "https://graph.facebook.com/" + this.pageid + "?access_token=" + this.pageToken + "&fields=new_like_count&since=" + sdt + "&until=" + edt + "&period=day";
    this.http.get(url).subscribe(res => {
      if (res) {

        let avgNum = 0;
        avgNum = this.calculateDateSlabDiff(this.toDate.value, this.fromDate.value);
        if (isPrev == 0) {
          this.pageNewlikesTotal = res['new_like_count'];
          this.avgNewlikes = this.getAverage(this.pageNewlikesTotal, avgNum);
        }
        if (isPrev == 1) {
          this.pageNewlikesTotalPrev = res['new_like_count'];

          let diff = this.pageNewlikesTotal - this.pageNewlikesTotalPrev;
          this.percentpageNewlikes = this.getPercentageChange(this.pageNewlikesTotalPrev, this.pageNewlikesTotal);
          if (diff < 0) {
            this.percentpageNewlikes = this.pos_to_neg(this.percentpageNewlikes).toFixed(2);
          }
        }
      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  getPageLikes(sdt, edt) {


    const url = "https://graph.facebook.com/" + this.pageid + "?access_token=" + this.pageToken + "&fields=country_page_likes&since=" + sdt + "&until=" + edt + "&period=day";
    this.http.get(url).subscribe(res => {
      if (res) {

        this.pagelikesTotal = res['country_page_likes'];
      }
    }, error => {
      this.snackbarService.show('Fetch Total Likes Count Failed : ' + JSON.stringify(error.error));
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
