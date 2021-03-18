import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { AuditsService } from '../../audits/audits.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { AccountService } from '../../account/account.service';
import { HomeGscService } from '../homeGsc.service';
import { DatePipe } from '@angular/common';
import { parseDate } from 'ngx-bootstrap/chronos';
import { environment } from 'src/environments/environment';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { FacebookService, LoginOptions, LoginResponse } from 'ngx-facebook';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hasGaSetup:boolean;
  campaignList = [];
  CampaignGAList=[];
  CampaignGSCList=[];
  CampaignGAdsList=[];
  SelectedCampaignId;
  CampaignFacebookList=[];
  //Traffic
  thisMonthTraffic = 0;
  lastMonthTraffic = 0;
  IsError = true;
  trafficPve = 0;
  trafficNve = 0;
  trafficNut = 0;
  trafficPvePer = 0;
  trafficNvePer = 0;
  trafficNutPer = 0;
  //Conversions
  thisMonthConversions = 0;
  lastMonthConversions = 0;
  ConversionsPve = 0;
  ConversionsNve = 0;
  ConversionsNut = 0;
  ConversionsPvePer = 0;
  ConversionsNvePer = 0;
  ConversionsNutPer = 0;
  //Ranking
  serpList;
  averageRanking;
  selectedCampId: string;
  tempRankingGraphData = [];
  RankingGraphData = [];
  //facebook
  pageReachTotal;
  percentFacebook;
  thisMonthFacebook;
  lastMonthFacebook;
  facebookPageToken;
  facebookUserId;
  facebookAccessToken;
  //GSC data variables
  clicksData = [];
  dateListData = [];
  impressionData;
  currDate: string;
  previousStartDate;
  previousEndDate;
  toDate = new FormControl(new Date())
  fromDate = new FormControl(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  currYear: number;
  myForm = new FormGroup({
    fromDate: this.fromDate,
    toDate: this.toDate,
  });

  startDate;
  endDate;
  clicksThisYear: string = "0";
  clicksPreviousYear: string = "0";
  impressionsThisYear: string = "0";
  impressionsPreviousYear: string = "0";
  cTRThisYear: string = "0";
  cTRPreviousYear: string = "0";
  positionThisYear: string = "0";
  positionPreviousYear: string = "0";
  percentClicks;
  percentImpressions;
  percentCTR;
  percentPosition;
  selectedCampIdWebUrl: string;
  selectedCampaignName: string;

  accessToken = localStorage.getItem('googleGscAccessToken');
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  //for all percentage and graphs
  pve = 0;
  nve = 0;
  nut = 0;
  perpve;
  pernve;
  pernut;
  total;
  tableData: Campaign[];
  siteurl: string;
  showProgressbar: boolean = false;
  toaster: any;
  valForm: FormGroup;
  public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  toasterConfig: any;
  toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-right',
    showCloseButton: true
  });

  CompanyID: string;
  companyinformation: any;

  public pieChartLabels1 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData1 = [5, 1, 1];
  public pieChartType1 = 'pie';
  public pieOptions1 = {
    legend: {
      display: false
    }
  };

  public pieChartLabels2 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData2 = ['75', '36', '55'];
  public pieChartType2 = 'pie';
  public pieOptions2 = {
    legend: {
      display: false
    }
  };


  public pieChartLabels3 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData3 = ['85', '75', '65'];
  public pieChartType3 = 'pie';
  public pieOptions3 = {
    legend: {
      display: false
    }
  };

  public pieChartLabels4 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData4 = ['45', '66', '59'];
  public pieChartType4 = 'pie';
  public pieOptions4 = {
    legend: {
      display: false
    }
  };

  public pieChartLabels5 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData5 = ['45', '88', '52'];
  public pieChartType5 = 'pie';
  public pieOptions5 = {
    legend: {
      display: false
    }
  };

  public pieChartLabels6 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData6 = ['25', '66', '70'];
  public pieChartType6 = 'pie';
  public pieOptions6 = {
    legend: {
      display: false
    }
  };


  constructor(private authService: SocialAuthService, private facebook: FacebookService, public datepipe: DatePipe, private homeGscService: HomeGscService, public http: HttpClient, public campaignService: CampaignService, private router: Router,
    public auditsService: AuditsService, public toasterService: ToasterService, public toastr: ToastrService
    , fb: FormBuilder, private openIdConnectService: OpenIdConnectService, private accountService: AccountService) {
    //  this.facebookPageToken = localStorage.getItem('FacebookAccessToken');
    //Ranking
    this.hasGaSetup =true;
    facebook.init({
      appId: environment.facebook_appid,
      version: 'v9.0'
    });
    this.getSerpList();
    this.getCampaignList();
    this.getRankingGraphDataAll();
    this.getCompany();


    this.toaster = {
      type: 'success',
      title: 'Audit report',
      text: 'Your report is ready..'
    };

    this.valForm = fb.group({
      'webUrl': [undefined, [Validators.required, Validators.pattern(this.myreg)]],
    })
  }

  settings = {
    actions: { add: false, edit: false, delete: false },
    columns: {
      name: {
        title: 'NAME',
        filter: false
      },
      webUrl: {
        title: 'WEBURL',
        filter: false
      },
      ranking: {
        title: 'RANKING',
        filter: false
      },
      traffic: {
        title: 'TRAFFIC',
        filter: false
      },
      gsc: {
        title: 'GSC',
        filter: false
      },
      socialMedia: {
        title: 'SOCIAL MEDIA',
        filter: false
      },
      googleLeads: {
        title: 'GOOGLE ADS',
        filter: false
      }
    }
  };
  source: LocalDataSource;


  getCompany() {

    var userId = this.openIdConnectService.user.profile.sub;
    this.accountService.getCompany(userId).subscribe(
      res => {
        if (res) {
          this.companyinformation = res
          this.CompanyID = this.companyinformation.companyID;
          localStorage.setItem('companyID', this.CompanyID);
          localStorage.setItem('userID', userId);
        }
      }
    )
  }
  //  using to get campaignList
  public getCampaignList(): void {

    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      debugger
      for (let i = 0; i < res.length; i++) {
        this.getRankingGraphDataDelete(res[i].id);
      }
    });
  }
  calculateRankings() {
    this.accessToken = localStorage.getItem('googleGscAccessToken');
    debugger
    if (this.accessToken != null && this.accessToken != undefined && this.accessToken != '') {
      const d = new Date();
      let currYear = d.getFullYear();
      for (let i = 0; i < this.campaignList.length; i++) {
        //  this.DeleteRankingGraphData(this.campaignList[i].id.toString());
        let p = this.tempRankingGraphData.filter(x => x.campaignId.toString().toLowerCase() === this.campaignList[i].id.toString().toLowerCase() && x.year == currYear)
        p.sort(function (a, b) {
          var MONTH = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
          };
          return a.year - b.year || MONTH[a.month] - MONTH[b.month];
        });
        let thisMonth = p[p.length - 1];
        let PrevMonth = p[p.length - 2];
        let tap = 0, pap = 0;
        if (thisMonth != undefined) { tap = thisMonth.avragePosition }
        if (PrevMonth != undefined) { pap = PrevMonth.avragePosition }
        let g = this.getDifference(pap, tap);

        if (g == 'NaN') { g = "0"; }
        this.total = this.campaignList.length;

        this.selectedCampIdWebUrl = this.campaignList[i].webUrl;
        debugger
        if (this.selectedCampIdWebUrl == '' || this.selectedCampIdWebUrl == null || this.selectedCampIdWebUrl == undefined) {
          if (this.facebookAccessToken != null && this.facebookAccessToken != undefined && this.facebookAccessToken != '') {
            this.getFacebookUserId(i);
          }
        } else {
          if (this.IsError == false) {
            this.getData(i);
            this.getAnalyticsProfileIds(i);
            this.campaignList[i].ranking = g + "%";
            this.addDataToPieChart(g, 1);
          }
        }
      }
    }
    this.tableData = this.campaignList;
    this.source = new LocalDataSource(this.campaignList)
  }
  addDataToPieChart(g, chartNo) {

    this.pve = 0;
    this.nve = 0;
    this.nut = 0;
    if (parseFloat(g) > 0) { this.pve = this.pve + 1; }
    if (parseFloat(g) < 0) { this.nve = this.nve + 1; }
    if (parseInt(g) == 0) { this.nut = this.nut + 1; }
    this.perpve = this.getPercentage(this.pve, this.total);
    this.pernve = this.getPercentage(this.nve, this.total);
    this.pernut = this.getPercentage(this.nut, this.total);
    if (this.perpve == "undefined" || this.perpve == "NaN") {
      this.perpve = 0;
    }
    if (this.pernve == "undefined" || this.pernve == "NaN") {
      this.pernve = 0;
    }
    if (this.pernut == "undefined" || this.pernut == "NaN") {
      this.pernut = 0;
    }
    if (chartNo == 1) {
      this.pieChartData1 = [this.perpve, this.pernve, this.pernut];
    }
    if (chartNo == 4) {
      this.pieChartData4 = [this.perpve, this.pernve, this.pernut];
    }
    if (chartNo == 5) {
      this.pieChartData5 = [this.perpve, this.pernve, this.pernut];
    }
  }

  // using to view list of audits
  public goToAudits(event) {
    event.preventDefault()
    this.router.navigate(['/home/audits']);
  }

  // using to search campaign locally
  onSearch(query: string = '') {
    if (query == "") {
      this.source = new LocalDataSource(this.campaignList)
    }
    else {
      this.source.setFilter([
        // fields we want to include in the search
        {
          field: 'name',
          search: query
        },
      ], false);
      // second parameter specifying whether to perform 'AND' or 'OR' search 
      // (meaning all columns should contain search query or at least one)
      // 'AND' by default, so changing to 'OR' by setting false here
    }

  }
  // using to run audit of entered url 
  public runAudit(event, value) {
    if (this.valForm.invalid) {
      this.valForm.get('webUrl').markAsTouched();
    }
    else {
      this.toastr.info('Your Report is under progress...you can see your report when it is completed', 'Audit Report')
      this.auditsService.settingsTaskWebsite(this.siteurl).subscribe(res => {

      })
    }

  }

  //using to open create campaign view to create new campaign in db
  public onClick(): any {
    this.router.navigate(['/home/campaign']);
  }

  // using to view analytics report of selected campaign Id
  userRowSelect(campaign: any): void {
    this.SelectedCampaignId = campaign.data.id;
    let ga = this.CampaignGAList.filter(x => x.campaignID == this.SelectedCampaignId);
    if(ga !=null && ga != undefined && ga.length > 0){
     localStorage.setItem('gaurl', ga[0]['urlOrName']);
     localStorage.setItem('gaaccesstoken', ga[0]['accessToken']);
    }
    let gads = this.CampaignGAdsList.filter(x => x.campaignID == this.SelectedCampaignId);
    if(gads !=null && gads != undefined && gads.length > 0){
     localStorage.setItem('gadsurl', gads[0]['urlOrName']);
     localStorage.setItem('gadsaccesstoken', gads[0]['accessToken']);
    }
    let facebook = this.CampaignFacebookList.filter(x => x.campaignID == this.SelectedCampaignId);
    if(facebook !=null && facebook != undefined && facebook.length > 0){
     localStorage.setItem('facebookpagename', facebook[0]['urlOrName']);
     localStorage.setItem('facebookaccesstoken', facebook[0]['accessToken']);
    }
    let gsc = this.CampaignGSCList.filter(x => x.campaignID == this.SelectedCampaignId);
    if(gsc !=null && gsc != undefined && gsc.length > 0){
     localStorage.setItem('gscurl', gsc[0]['urlOrName']);
     localStorage.setItem('gscaccesstoken', gsc[0]['accessToken']);
    }
     localStorage.setItem('selectedCampId', campaign.data.id);
     localStorage.setItem('selectedCampName', campaign.data.name);
     this.router.navigate([`../campaign/:id${campaign.data.id}/seo`]);
    // this.router.navigate(['/campaign', { id: campaign.data.id }], {
    //   queryParams: {
    //     view: 'showReport'
    //   },
    // });


  }
  //Ranking Data
  public getSerpList(): void {
    this.campaignService.getSerp("&tbs=qdr:m").subscribe(res => {
      this.serpList = res;

    });
  }

  private getFilterOptionPlans() {
    return {
      pageNumber: 1,
      pageSize: 1000,
      fields: '',
      searchQuery: '',
      orderBy: ''
    }
  }

  getDifference(previous, current) {
    // Decrease = Original Number - New Number
    // % Decrease = Decrease ÷ Original Number × 100
    // let diff = ((parseFloat(previous) - parseFloat(current)) * 100) / parseFloat(previous)
    // return parseFloat(diff.toString()).toFixed(2);
    let diff = (parseFloat(previous) - parseFloat(current));
    let per = (diff / parseFloat(current)) * 100
    return parseFloat(per.toString()).toFixed(2);
  }

  //############################################### GSC data
  getDataByDevice(startDate, endDate) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');


    const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2F" + urlcamp + "%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    let data = {};

    data = {
      "startRow": 0,
      "startDate": startDate,
      "endDate": endDate,
      "dataState": "ALL",
      "dimensions": [
        "DEVICE"
      ]
    };
    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];

      }
    }, error => {
      console.log('Data fetch failed by device : ' + JSON.stringify(error.error));
    });
  }
  getDataCurrentYear(startDate, endDate, all, url, i) {
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };


    //let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
    //const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Feintelligence.azurewebsites.net%2F/searchAnalytics/query";
    //const url = "https://www.googleapis.com/webmasters/v3/sites/http:%2F%2F" + urlcamp + "%2F/searchAnalytics/query";
    //const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.abhisi.com%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    let data = {};
    if (all == 1) {
      data = {
        "startRow": 0,
        "startDate": startDate,
        "endDate": endDate,
        "dataState": "ALL",
        "dimensions": [
          "DATE"
        ]
      };
    }
    if (all == 0) {
      data = {
        "startRow": 0,
        "startDate": startDate,
        "endDate": endDate,
        "dataState": "ALL",
      };
    }
    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        if (all == 0) {
          this.clicksThisYear = rows[0].clicks;
          this.impressionsThisYear = rows[0].impressions;
          this.cTRThisYear = parseFloat(rows[0].ctr).toFixed(2).toString();
          this.positionThisYear = parseFloat(rows[0].position).toFixed(2).toString();
        }
        else {
          this.dateListData = [];
          for (let i = 0; i < rows.length; i++) {
            this.currDate = rows[i].keys[0]
            this.currDate = this.currDate.substring(5, 10);
          }
        }
        this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, 0, i, url);
        this.getDataCurrentYear(this.startDate, this.endDate, 1, url, i);
        this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, 1, i, url);
      }
    }, error => {

      this.IsError = true;
      console.log("Please Login with your google account");
      // console.log('Data fetch failed for current year for URL : ' + this.selectedCampIdWebUrl + " --Error : - " + JSON.stringify(error.error));
    });

  }
  getDataPreviousYear(startDate, endDate, all, i, url) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    //let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
    //const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2F" + urlcamp + "%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    let data = {
      "startRow": 0,
      "startDate": startDate,
      "endDate": endDate,
      "dataState": "ALL",
      "dimensions": [
        "DATE"
      ]
    };
    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {
        let rows = res['rows'];
        if (all == 0) {
          this.clicksPreviousYear = rows[0].clicks;
          this.impressionsPreviousYear = rows[0].impressions;
          this.cTRPreviousYear = parseFloat(rows[0].ctr).toFixed(2).toString();
          this.positionPreviousYear = parseFloat(rows[0].position).toFixed(2).toString();
          //pecentgage calculate
          this.percentClicks = this.getYearwiseDifference(this.clicksPreviousYear, this.clicksThisYear);
          this.campaignList[i].gsc = this.percentClicks + "%";
          this.addDataToPieChart(this.percentClicks, 4);
          this.tableData = this.campaignList;
          this.source = new LocalDataSource(this.campaignList)
          this.percentImpressions = this.getYearwiseDifference(this.impressionsPreviousYear, this.impressionsThisYear);
          this.percentPosition = this.getYearwiseDifference(this.positionPreviousYear, this.positionThisYear);
          this.percentCTR = this.getYearwiseDifference(this.cTRPreviousYear, this.cTRThisYear);
        }
        else {
          this.dateListData = [];
          for (let i = 0; i < rows.length; i++) {
            this.currDate = rows[i].keys[0]
            this.currDate = this.currDate.substring(5, 10);
          }
        }
      }
    }, error => {
      this.campaignList[i].gsc = "0%";
      this.addDataToPieChart("", 4);
      console.log('Data fetch failed for previous year for URL : ' + this.selectedCampIdWebUrl + " --Error : - " + JSON.stringify(error.error));
    });
  }
  ngOnInit() {
    this.trafficPvePer = 0;
    this.trafficNvePer = 0;
    this.trafficNutPer = 0;
    this.trafficPve = 0;
    this.trafficNve = 0;
    this.trafficNut = 0;
    this.ConversionsPvePer = 0;
    this.ConversionsNvePer = 0;
    this.ConversionsNutPer = 0;
    this.ConversionsPve = 0;
    this.ConversionsNve = 0;
    this.ConversionsNut = 0;
    this.getCampaignList();
    this.getCampaignGA();
    this.getCampaignGAds();
    this.getCampaignFacebook();
    this.getCampaignGSC();
  }
  onStartDateChange(event) {
    this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.currYear = parseInt(this.datepipe.transform(this.fromDate.value, 'yyyy'));
    let prevYear = this.currYear - 1;
    this.previousStartDate = prevYear.toString() + '-' + this.datepipe.transform(this.fromDate.value, 'MM-dd');

    this.getData(0);
  }

  onEndDateChange(event) {
    this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
    this.currYear = parseInt(this.datepipe.transform(this.toDate.value, 'yyyy'));
    let prevYear = this.currYear - 1;
    this.previousEndDate = prevYear.toString() + '-' + this.datepipe.transform(this.toDate.value, 'MM-dd');

    this.getData(0);
  }
  getData(i) {

    this.accessToken = localStorage.getItem('googleGscAccessToken');
    this.getDateSettings();
    if (this.accessToken == '' || this.accessToken == undefined || this.accessToken == null) {
      console.log("Please, Login with Google to fetch data");
    } else if (parseDate(this.endDate) < parseDate(this.startDate)) {
      console.log("Start Date can not be grater then End Date");
    }
    else {

      let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
      const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2F" + urlcamp + "/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
      //const url = "https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fpatwa.co.in/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ"
      // const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2F" + urlcamp + "%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
      //const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.abhisi.com%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
      this.getDataCurrentYear(this.startDate, this.endDate, 0, url, i);
      if (this.IsError == false) {

      }
      // this.getDataByDevice(this.startDate, this.endDate)

    }
  }
  getDateSettings() {
    let currDate = new Date();
    this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    this.startDate = this.datepipe.transform(currDate.setMonth(currDate.getMonth() - 1), 'yyyy-MM-dd');
    this.previousEndDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    this.previousStartDate = this.datepipe.transform(currDate.setMonth(currDate.getMonth() - 1), 'yyyy-MM-dd');
  }

  getYearwiseDifference(previous, current) {
    let diff = (parseFloat(previous) - parseFloat(current));
    let per = (diff / parseFloat(current)) * 100
    return parseFloat(per.toString()).toFixed(2);
    // let diff = ((parseFloat(previous) - parseFloat(current)) * 100) / parseFloat(previous)
    // return parseFloat(diff.toString()).toFixed(2)

  }
  getPercentage(num, total) {
    return ((100 * num) / total)
  }
  //Facebook data
  facebookDataThisMonth(index) {

    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique?access_token=" + this.facebookPageToken;
    this.http.get(url).subscribe(res => {
      if (res) {

        for (let i = 0; i < res['data'].length; i++) {
          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique' && p.period == 'days_28') {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }
            this.thisMonthFacebook = this.pageReachTotal;

          }
        }
      }
    }
      , error => {
        console.log('Fetch Facebook Data Failed : ' + JSON.stringify(error.error));
      });
  }
  facebookDataLastMonth(index) {

    const url = "https://graph.facebook.com/" + environment.facebook_pageid + "/insights/page_impressions_unique,page_total_actions,page_positive_feedback_by_type,page_negative_feedback,page_views_total,page_impressions,page_views_external_referrals,page_fans_by_unlike_source_unique,page_impressions_organic,page_impressions_paid,page_fan_removes_unique?access_token=" + this.facebookPageToken;
    this.http.get(url).subscribe(res => {
      if (res) {

        for (let i = 0; i < res['data'].length; i++) {
          let p = res['data'][i];
          //Page Reach
          if (p.name == 'page_impressions_unique' && p.period == 'days_28') {
            let l = p['values'];
            this.pageReachTotal = 0;
            for (let k = 0; k < l.length; k++) {
              this.pageReachTotal = parseInt(this.pageReachTotal) + parseInt(l[k].value)
            }

            this.lastMonthFacebook = this.pageReachTotal;
            this.percentFacebook = this.getDifference(this.thisMonthFacebook, this.lastMonthFacebook);
            this.campaignList[index].socialMedia = this.percentFacebook;
            this.tableData = this.campaignList;
            this.source = new LocalDataSource(this.campaignList)
            this.addDataToPieChart(this.percentFacebook, 5);
          }
        }
      }
    }
      , error => {
        console.log('Fetch Facebook Data Failed : ' + JSON.stringify(error.error));
      });
  }
  getFacebookUserId(i) {

    const url = "https://graph.facebook.com/me?access_token=" + this.facebookAccessToken + "&fields=id,name";
    this.http.get(url).subscribe(res => {
      if (res) {

        this.facebookUserId = res['id'];
        this.generatePageToken(i);
      }
    }, error => {
      console.log('Fetch Facebook USerId Failed : ' + JSON.stringify(error.error));
    });
  }
  generatePageToken(i) {

    const url = "https://graph.facebook.com/" + this.facebookUserId + "/accounts?access_token=" + this.facebookAccessToken;
    // const url = "https://graph.facebook.com/105114094889635/accounts?access_token=EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD";
    this.http.get(url).subscribe(res => {
      if (res) {

        this.facebookPageToken = res['data'][0].access_token;
        this.facebookDataThisMonth(i);
        this.facebookDataLastMonth(i);
      }
    }, error => {
      console.log('Fetch Page Token Failed : ' + JSON.stringify(error.error));
    });
  }
  signInWithGoogle(): void {

    const googleLoginOptions = {
      scope: 'profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit'
    };
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
      .then((res) => {
        this.trafficPvePer = 0;
        this.trafficNvePer = 0;
        this.trafficNutPer = 0;
        this.trafficPve = 0;
        this.trafficNve = 0;
        this.trafficNut = 0;
        this.ConversionsPvePer = 0;
        this.ConversionsNvePer = 0;
        this.ConversionsNutPer = 0;
        this.ConversionsPve = 0;
        this.ConversionsNve = 0;
        this.ConversionsNut = 0;
        this.IsError = false;
        this.accessToken = res['authToken'];
        localStorage.setItem('googleGscAccessToken', this.accessToken);
        this.calculateRankings();
      })
  }
  loginWithOptions(i) {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      // scope: 'public_profile,user_friends,email,pages_show_list'
      //scope: 'pages_show_list'
      scope: 'pages_show_list,read_insights,pages_read_engagement'
    };

    this.facebook.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
        this.facebookAccessToken = res['authResponse'].accessToken;
        localStorage.setItem('FacebookAccessToken', this.accessToken);
        this.getFacebookUserId(i);


      })
      .catch(this.handleError);
  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  getUserId() {
    const url = "https://graph.facebook.com/me?access_token=" + this.facebookAccessToken + "&fields=id,name";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.facebookUserId = res['id'];
        this.generatePageToken2();
      }
    }, error => {
      console.log('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }
  generatePageToken2() {
    const url = "https://graph.facebook.com/" + this.facebookUserId + "/accounts?access_token=" + this.facebookAccessToken;
    // const url = "https://graph.facebook.com/105114094889635/accounts?access_token=EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD";
    this.http.get(url).subscribe(res => {
      if (res) {
        this.facebookPageToken = res['data'][0].access_token;
      }
    }, error => {
      console.log('Fetch Page Token Failed : ' + JSON.stringify(error.error));
    });
  }
  //Google Analytics

  getAnalyticsProfileIds(campaignIndex) {


    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/management/accountSummaries";
    //const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:83658108&dimensions=ga:date&start-date=2019-10-01&end-date=2021-02-15&metrics=ga:sessions";
    //https://www.googleapis.com/analytics/v3/management/accounts/49139272/webproperties
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['items'];
        //let accountSummaryIds=[];
        for (let i = 0; i < rows.length; i++) {

          let p = rows[i]
          let q = p['webProperties']['0'].websiteUrl.toString();

          let u = this.campaignList[campaignIndex].webUrl;
          if (q.includes(u)) {
            this.getAnalyticsOrganicTrafficThisMonth(rows[i].webProperties[0].profiles[0].id, campaignIndex);
            this.getAnalyticsOrganicTrafficLastMonth(rows[i].webProperties[0].profiles[0].id, campaignIndex);

            break;
          }
          // accountSummaryIds.push(rows[i].webProperties[0].profiles[0].id);
        }

      }
    }, error => {

      alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });

  }
  getAnalyticsOrganicTrafficThisMonth(profileid, campaignIndex) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + this.startDate + "&end-date=" + this.endDate + "&metrics=ga%3AorganicSearches%2Cga%3AgoalConversionRateAll";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];

        this.thisMonthTraffic = rows[0]["0"];
        this.lastMonthConversions = rows[0]["1"];
        debugger
      }
    }, error => {

      alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsOrganicTrafficLastMonth(profileid, campaignIndex) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + this.previousStartDate + "&end-date=" + this.previousEndDate + "&metrics=ga%3AorganicSearches%2Cga%3AgoalConversionRateAll";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        debugger
        let rows = res['rows'];
        //Traffic Calculation
        this.lastMonthTraffic = rows[0]["0"];
        let perTraffic = this.getDifference(this.lastMonthTraffic, this.thisMonthTraffic);
        if (parseFloat(perTraffic) > 0) { this.trafficPve = this.trafficPve + 1; }
        if (parseFloat(perTraffic) < 0) { this.trafficNve = this.trafficNve + 1; }
        if (parseInt(perTraffic) == 0) { this.trafficNut = this.trafficNut + 1; }
        this.trafficPvePer = this.getPercentage(this.trafficPve, this.total);
        this.trafficNvePer = this.getPercentage(this.trafficNve, this.total);
        this.trafficNutPer = this.getPercentage(this.trafficNut, this.total);
        this.pieChartData2 = [this.trafficPvePer.toString(), this.trafficNvePer.toString(), this.trafficNutPer.toString()];
        //Converssions calculation for chart
        this.thisMonthConversions = rows[0]["1"];
        let perConversions = this.getDifference(this.lastMonthConversions, this.thisMonthConversions);
        if (parseFloat(perConversions) > 0) { this.ConversionsPve = this.ConversionsPve + 1; }
        if (parseFloat(perConversions) < 0) { this.ConversionsNve = this.ConversionsNve + 1; }
        if (parseInt(perConversions) == 0) { this.ConversionsNut = this.ConversionsNut + 1; }
        this.ConversionsPvePer = this.getPercentage(this.ConversionsPve, this.total);
        this.ConversionsNvePer = this.getPercentage(this.ConversionsNve, this.total);
        this.ConversionsNutPer = this.getPercentage(this.ConversionsNut, this.total);
        this.pieChartData3 = [this.ConversionsPvePer.toString(), this.ConversionsNvePer.toString(), this.ConversionsNutPer.toString()];
        this.campaignList[campaignIndex].traffic = perTraffic;
        this.tableData = this.campaignList;
        this.source = new LocalDataSource(this.campaignList)
      }
    }, error => {

      alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  //For ranking graph rubina
  RefreshRankingGraphData(selectedCampId) {
    debugger
    const d = new Date();
    let currYear = d.getFullYear();
    let p;
    let totalPosition = 0;
    p = this.serpList.filter(x => x.campaignID.toString() === selectedCampId.toLowerCase());
    if (p != null && p != undefined && p.length > 0) {
      for (let i = 0; i < p.length; i++) {
        totalPosition = totalPosition + p[i].position;
      }
    }
    this.averageRanking = totalPosition / parseInt(this.serpList.length)
    this.averageRanking = Math.round(this.averageRanking);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    let currMonth = monthNames[d.getMonth()];
    let data = {
      id: "00000000-0000-0000-0000-000000000000",
      avragePosition: this.averageRanking,
      month: currMonth,
      campaignId: selectedCampId,
      year: currYear,
    }
    this.campaignService.createRankingGraph(data).subscribe(response => {
      if (response) {
        debugger
        this.getRankingGraphData(selectedCampId);
      }
    });
  }
  DeleteRankingGraphData(selectedCampId) {
    debugger
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    let currMonth = monthNames[d.getMonth()];
    let tempId;
    let p = this.tempRankingGraphData.filter(x => x.month == currMonth)
    if (p != null && p != undefined && p.length > 0) {
      tempId = p[0].id;
      this.campaignService.deleteRankingGraph(tempId).subscribe(response => {
        debugger
        this.RefreshRankingGraphData(selectedCampId);
      });
    } else {
      this.RefreshRankingGraphData(selectedCampId);
    }
  }
  getRankingGraphDataDelete(selectedCampId) {
    const d = new Date();
    let currYear = d.getFullYear();
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOptionPlans();
    this.campaignService.getFilteredRankingGraph(filterOptionModel).subscribe((response: any) => {
      if (response) {
        debugger
        this.RankingGraphData = response.body;
        this.RankingGraphData = this.RankingGraphData.filter(x => x.campaignId.toString() === selectedCampId.toLowerCase() && x.year == currYear);
        this.tempRankingGraphData = this.RankingGraphData;
        this.DeleteRankingGraphData(selectedCampId);
      }
    });
  }
  getRankingGraphDataAll() {
    const d = new Date();
    let currYear = d.getFullYear();
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOptionPlans();
    this.campaignService.getFilteredRankingGraph(filterOptionModel).subscribe((response: any) => {
      if (response) {
        debugger
        this.RankingGraphData = response.body;
        this.RankingGraphData = this.RankingGraphData.filter(x => x.year == currYear);
        this.tempRankingGraphData = this.RankingGraphData;
        this.calculateRankings();
      }
    });
  }
  getRankingGraphData(selectedCampId) {
    debugger
    const d = new Date();

    let currYear = d.getFullYear();
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOptionPlans();
    this.campaignService.getFilteredRankingGraph(filterOptionModel).subscribe((response: any) => {
      if (response) {
        debugger
        this.RankingGraphData = response.body;
        this.RankingGraphData = this.RankingGraphData.filter(x => x.campaignId.toString() === selectedCampId.toLowerCase() && x.year == currYear);
        this.tempRankingGraphData = this.RankingGraphData;
        this.RankingGraphData.sort(function (a, b) {
          var MONTH = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
          };
          return a.year - b.year || MONTH[a.month] - MONTH[b.month];
        });
      }
    })
  }
  ///Fr redirect to seo
  
  private getFilterOption() {
    return {
      pageNumber: 1,
      pageSize: 1000,
      fields: '',
      searchQuery: '',
      orderBy: ''
    }

  }
  getCampaignGA() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGA(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.CampaignGAList = response.body;
      
      }
    })
  }
  getCampaignGAds() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGAds(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.CampaignGAdsList = response.body;
      }
    })
  }
  getCampaignGSC() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGSC(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.CampaignGSCList = response.body;
      }
    })
  }
  getCampaignFacebook() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredFacebook(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.CampaignFacebookList = response.body;
      }
    })
  }
}
