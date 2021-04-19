import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TranslateService } from '@ngx-translate/core';
import { env } from 'process';
const success = require('sweetalert');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hasGaSetup: boolean;
  campaignList = [];
  CampaignGAList = [];
  CampaignGSCList = [];
  CampaignGAdsList = [];
  SelectedCampaignId;
  CampaignFacebookList = [];
  gscaccesstoken;
  gaaccesstoken;

  //Ranking
  rankingThis = 0;
  rankingPrev = 0;
  tempSerpList = [];
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
  fromDate = new FormControl(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000))
  currYear: number;
  myForm = new FormGroup({
    fromDate: this.fromDate,
    toDate: this.toDate,
  });

  startDate;
  endDate;
  tempStr: string = "";
  tempRes: string = "";
  tempDate = new Date();
  clicksThisYear: string = "0";
  clicksPreviousYear: string = "0";
  impressionsThisYear: number = 0;
  impressionsPreviousYear: number = 0;
  impressionPve = 0;
  impressionNve = 0;
  impressionNute = 0;
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
  yCode
  code
  httpOptionJSON1 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };
  settings = {
    actions: {
      columnTitle: '',
      custom: [{ name: 'editCampaign', title: '<i class="fas fa-edit"></i>' },
      { name: 'deleteCampaign', title: '<span class="text-danger col"><i class="fas fa-trash-alt"></i></span>' }
      ],
      add: false, edit: false, delete: false, position: 'right'
    },
    columns: {
      SrNo: {
        title: 'Sr No.',
        filter: false,
        type: 'text',
        valuePrepareFunction: (value, row, cell) => {

          return cell.row.index + 1;
        }
      },
      name: {
        title: 'Project',
        filter: false
      },
      webUrl: {
        title: 'Website',
        filter: false,
        type: 'html',
        valuePrepareFunction: (value) => {
          ;
          let a = value;
          let b = "https://www.";
          let c = b.concat(a);
          return `<a href=` + c + `  target="_blank" rel="noopener noreferrer">` + a + `</a>`;
        }
      },
      ranking: {
        title: 'SE Avg. Position',
        filter: false,
        type: 'html',
        valuePrepareFunction: (value) => {
          this.tempStr = value;

          let st = this.tempStr.split("--");
          if (this.tempStr != '' && this.tempStr != undefined && this.tempStr != null) {
            if (this.tempStr.toString().includes("--")) {
              let diff = parseInt(st[0]) - parseInt(st[1])
              diff = parseInt(diff.toString().replace('-', ''));
              if (parseInt(st[0]) == 0) {
                this.tempRes = st[0] + ` <span class="text-success"><i class='fas fa-arrow-alt-circle-up'></i></span> ` + diff
              } else if (parseInt(st[0]) > parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-success"><i class='fas fa-arrow-alt-circle-up'></i></span> ` + diff
              } else if (parseInt(st[0]) < parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-danger"><i class='fas fa-arrow-alt-circle-down'></i></span> ` + diff
              } else if (parseInt(st[0]) == parseInt(st[1])) {
                this.tempRes = st[0] + " - " + diff;
              }
            }
          } else {
            this.tempRes = st[0] + " - " + st[1];
          }
          if (this.tempRes.includes('undefined')) {
            this.tempRes = '';
          }
          return this.tempRes;
        }

      },
      traffic: {
        title: 'Organic Traffic',
        filter: false,
        type: 'html',
        valuePrepareFunction: (value) => {
          this.tempStr = value;

          let st = this.tempStr.split("--");
          if (this.tempStr != '' && this.tempStr != undefined && this.tempStr != null) {
            if (this.tempStr.toString().includes("--")) {
              let diff = parseInt(st[0]) - parseInt(st[1])
              diff = parseInt(diff.toString().replace('-', ''));
              if (parseInt(st[0]) > parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-danger"><i class='fas fa-arrow-alt-circle-down'></i></span> ` + diff
              }
              if (parseInt(st[0]) < parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-success"><i class='fas fa-arrow-alt-circle-up'></i></span> ` + diff
              }
              if (parseInt(st[0]) == parseInt(st[1])) {
                this.tempRes = st[0] + " - " + diff;
              }
            }
          } else {
            this.tempRes = st[0] + " - " + st[1];
          }
          if (this.tempRes.includes('undefined')) {
            this.tempRes = '';
          }
          return this.tempRes;
        }

      },
      gsc: {
        title: 'SE Impressions',
        filter: false,
        type: 'html',
        valuePrepareFunction: (value) => {
          this.tempStr = value;

          let st = this.tempStr.split("--");
          if (this.tempStr != '' && this.tempStr != undefined && this.tempStr != null) {
            if (this.tempStr.toString().includes("--")) {
              let diff = parseInt(st[0]) - parseInt(st[1])
              diff = parseInt(diff.toString().replace('-', ''));
              if (parseInt(st[0]) > parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-danger"><i class='fas fa-arrow-alt-circle-down' ></i></span> ` + diff
              }
              if (parseInt(st[0]) < parseInt(st[1])) {
                this.tempRes = st[0] + `<span class="text-success"> <i class='fas fa-arrow-alt-circle-up' ></i></span> ` + diff
              }
              if (parseInt(st[0]) == parseInt(st[1])) {
                this.tempRes = st[0] + " - " + diff;
              }
            }
          } else {
            this.tempRes = st[0] + " - " + st[1];
          }
          if (this.tempRes.includes('undefined')) {
            this.tempRes = '';
          }
          return this.tempRes;
        }



      },
      socialMedia: {
        title: 'SM Engagement',
        filter: false,
        type: 'html',
        valuePrepareFunction: (value) => {
          this.tempStr = value;

          let st = this.tempStr.split("--");
          if (this.tempStr != '' && this.tempStr != undefined && this.tempStr != null) {
            if (this.tempStr.toString().includes("--")) {
              let diff = parseInt(st[0]) - parseInt(st[1])
              diff = parseInt(diff.toString().replace('-', ''));
              if (parseInt(st[0]) > parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-danger"><i class='fas fa-arrow-alt-circle-down'></i></span>` + diff
              }
              if (parseInt(st[0]) < parseInt(st[1])) {
                this.tempRes = st[0] + ` <span class="text-success"> <i class='fas fa-arrow-alt-circle-up' ></i></span> ` + diff
              }
              if (parseInt(st[0]) == parseInt(st[1])) {
                this.tempRes = st[0] + " - " + diff;
              }
            }
          } else {
            this.tempRes = st[0] + " - " + st[1];
          }
          if (this.tempRes.includes('undefined')) {
            this.tempRes = '';
          }
          return this.tempRes;
        }



      },
      googleLeads: {
        title: 'Google Ads Conversions',
        filter: false
      },
    }
  };
  source: LocalDataSource;
  instacode;
  instaAccessToken;
  constructor(private translate: TranslateService, private authService: SocialAuthService, private facebook: FacebookService, public datepipe: DatePipe, private homeGscService: HomeGscService, public http: HttpClient, public campaignService: CampaignService, private router: Router,
    public auditsService: AuditsService, public toasterService: ToasterService, public toastr: ToastrService
    , fb: FormBuilder, private route: ActivatedRoute, private openIdConnectService: OpenIdConnectService, private accountService: AccountService) {
    //  this.facebookPageToken = localStorage.getItem('FacebookAccessToken');
    //Ranking
    this.getCompany();
    this.hasGaSetup = true;
    facebook.init({
      appId: environment.facebook_appid,
      version: 'v9.0'
    });

    this.getDateDiff();
    let ycode = localStorage.getItem("gacode");
    if (ycode != 'null' && ycode != null && ycode != undefined && ycode != '') {
      this.router.navigate(['/home/campaign']);
    }
    let gsccode = localStorage.getItem("gsccode");
    if (gsccode != 'null' && gsccode != null && gsccode != undefined && gsccode != '') {
      this.router.navigate(['/home/campaign']);
    }
    this.instacode = localStorage.getItem("instacode");
    if (this.instacode != 'null' && this.instacode != null && this.instacode != undefined && this.instacode != '') {
      this.getTokenInstagram(this.instacode);
    }
  }
  getTokenInstagram(code) {

    const url = "https://api.instagram.com/oauth/access_token";
    //const url = "https://www.googleapis.com/oauth2/v4/token";
    const body = new URLSearchParams();
    body.set('client_id', environment.insta_appid);
    body.set('client_secret', environment.insta_appsecret);
    body.set('code', code);
    body.set('grant_type', 'authorization_code');
    body.set('redirect_uri', environment.insta_redirecturl);
    this.http.post(url, body.toString(), this.httpOptionJSON1).subscribe(res => {
      if (res) {
        
        this.instaAccessToken = res["access_token"];
        this.getAllPagesList();

      }
    }, error => {
      console.log(error.message, 'Error');
    });
  }
  refreshTokenInstagram() {
    
    const url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id="+environment.insta_appid+"&client_secret="+environment.insta_appsecret+"&fb_exchange_token=" + this.instaAccessToken + "";
    this.http.get(url).subscribe(res => {
      if (res) {
        
        
      }
    }, error => {
      alert('Fetch Refresh Token Failed : ' + JSON.stringify(error.error));
    });
  }
  getAllPagesList() {
    const url = "https://graph.instagram.com/me?&access_token=" + this.instaAccessToken;
    this.http.get(url).subscribe(res => {
      if (res) {
    debugger
        let pagelist = res['data'];
        let currPage = pagelist.filter(x => x.name.toLowerCase() === this.selectedCampaignName.toLowerCase());
        //this.generatePageToken();
      }
    }, error => {
    });
  }
  
  ngOnInit() {
    this.resetChartVariables();
    this.getSerpList();
    this.getCampaignGA();
    this.getCampaignGAds();
    this.getCampaignFacebook();
    this.getCampaignGSC();
    this.getCampaignList();

  }
  getInstaToken() {

  }
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
  //###############################################For ranking graph rubina
  GetRankingPosition(selectedCampId) {

    this.tempSerpList = this.serpList;
    let p;
    let totalPosition = 0;
    // let todate=new Date(this.toDate.value);
    // todate = new Date(todate.setDate(todate.getDate()-1));
    //this slab
    //todate =new Date( todate.setHours(0,0,0,0));
    p = this.tempSerpList.filter(x => x.campaignID.toString() === selectedCampId.toLowerCase());
    if (p.length > 0) {

      p = p.filter(x => (new Date(x.createdOn).setHours(0, 0, 0, 0) <= new Date(this.toDate.value).setHours(0, 0, 0, 0) && new Date(x.createdOn).setHours(0, 0, 0, 0) >= new Date(this.fromDate.value).setHours(0, 0, 0, 0)));
      p = this.sortData(p);
      if (p.length > 0) {
        let maxDate = p[0].createdOn;

        p = p.filter(x => this.datepipe.transform(x.createdOn, 'yyyy-MM-dd') == this.datepipe.transform(maxDate, 'yyyy-MM-dd'));
        if (p != null && p != undefined && p.length > 0) {
          for (let i = 0; i < p.length; i++) {
            totalPosition = totalPosition + p[i].position;
          }
        }
        this.averageRanking = totalPosition / parseInt(p.length)
        this.rankingThis = Math.round(this.averageRanking);
      } else {
        this.rankingThis = 0;
      }
    }
    else {
      this.rankingThis = 0;
    }
    //Previous slab
    this.tempSerpList = this.serpList;
    totalPosition = 0;
    //let previousEndDate=new Date(this.previousEndDate.value);
    //previousEndDate = new Date(previousEndDate.setDate(todate.getDate()-1));
    p = this.tempSerpList.filter(x => x.campaignID.toString() === selectedCampId.toLowerCase());
    if (p.length > 0) {
      p = p.filter(x => (new Date(x.createdOn).setHours(0, 0, 0, 0) <= new Date(this.previousEndDate.value).setHours(0, 0, 0, 0) && new Date(x.createdOn).setHours(0, 0, 0, 0) >= new Date(this.previousStartDate.value).setHours(0, 0, 0, 0)));
      p = this.sortData(p);
      if (p.length > 0) {
        let maxDate = p[0].createdOn;
        p = p.filter(x => this.datepipe.transform(x.createdOn, 'yyyy-MM-dd') == this.datepipe.transform(maxDate, 'yyyy-MM-dd'));
        if (p != null && p != undefined && p.length > 0) {
          for (let i = 0; i < p.length; i++) {
            totalPosition = totalPosition + p[i].position;
          }
        }
        this.averageRanking = totalPosition / parseInt(p.length)
        this.rankingThis = Math.round(this.averageRanking);
      } else {
        this.rankingPrev = 0;
      }
    }
    else {
      this.rankingPrev = 0;
    }

    let g = this.rankingThis - this.rankingPrev;
    if (g > 0) { this.pve = this.pve + 1; }
    if (g < 0) { this.nve = this.nve + 1; }
    if (g == 0) { this.nut = this.nut + 1; }
    this.pieChartData1 = [this.pve, this.nve, this.nut];
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

  //using to open create campaign view to create new campaign in db
  public onClick(): any {
    localStorage.setItem('gaurl', '');
    localStorage.setItem('gaaccesstoken', '');
    localStorage.setItem('gadsaccesstoken', '');
    localStorage.setItem('facebookurl', '');
    localStorage.setItem('facebookaccesstoken', '');
    localStorage.setItem('gscurl', '');
    localStorage.setItem('gscaccesstoken', '');
    localStorage.setItem('selectedCampName', '');
    localStorage.setItem('selectedCampUrl', '');
    localStorage.setItem('editMasterId', '');
    localStorage.setItem('editMasterId', '');
    localStorage.setItem('gaid', '');
    localStorage.setItem('gadsid', '');
    localStorage.setItem('facebookid', '');
    localStorage.setItem('gscid', '');
    this.router.navigate(['/home/campaign']);
  }


  // using to view analytics report of selected campaign Id
  userRowSelect(campaign: any): void {
    localStorage.setItem('gaurl', '');
    localStorage.setItem('gaaccesstoken', '');
    localStorage.setItem('gadsaccesstoken', '');
    localStorage.setItem('facebookurl', '');
    localStorage.setItem('facebookaccesstoken', '');
    localStorage.setItem('gscurl', '');
    localStorage.setItem('gscaccesstoken', '');
    localStorage.setItem('selectedCampName', '');
    localStorage.setItem('selectedCampUrl', '');
    this.SelectedCampaignId = campaign.data.id;
    let ga = this.CampaignGAList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (ga != null && ga != undefined && ga.length > 0) {
      localStorage.setItem('gaurl', ga[0]['urlOrName']);
      localStorage.setItem('gaaccesstoken', ga[0]['accessToken']);
      localStorage.setItem('garefreshtoken', ga[0]['refreshToken']);
      localStorage.setItem('gaid', ga[0]['id']);
    }
    let gads = this.CampaignGAdsList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (gads != null && gads != undefined && gads.length > 0) {
      localStorage.setItem('gadsurl', gads[0]['urlOrName']);
      localStorage.setItem('gadsaccesstoken', gads[0]['accessToken']);
      localStorage.setItem('gadsid', gads[0]['id']);

    }
    let facebook = this.CampaignFacebookList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (facebook != null && facebook != undefined && facebook.length > 0) {
      localStorage.setItem('facebookpagename', facebook[0]['urlOrName']);
      localStorage.setItem('facebookaccesstoken', facebook[0]['accessToken']);
      localStorage.setItem('facebookid', facebook[0]['id']);

    }
    let gsc = this.CampaignGSCList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (gsc != null && gsc != undefined && gsc.length > 0) {
      localStorage.setItem('gscurl', gsc[0]['urlOrName']);
      localStorage.setItem('gscaccesstoken', gsc[0]['accessToken']);
      localStorage.setItem('gscrefreshtoken', gsc[0]['refreshToken']);
      localStorage.setItem('gscid', gsc[0]['id']);

    }
    localStorage.setItem('selectedCampId', campaign.data.id);
    localStorage.setItem('selectedCampName', campaign.data.name);
    localStorage.setItem('selectedCampUrl', campaign.data.webUrl);
    this.router.navigate([`../campaign/:id${campaign.data.id}/seo`]);


  }


  //############################################### GSC data
  getDataCurrentYear(startDate, endDate, url, campaignIndex) {
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gscaccesstoken,
      })
    };
    let data = {};

    data = {
      "startRow": 0,
      "startDate": startDate,
      "endDate": endDate,
      "dataState": "ALL",
    };

    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {
        let rows = res['rows'];
        this.clicksThisYear = rows[0].clicks;
        this.impressionsThisYear = rows[0].impressions;
        this.cTRThisYear = parseFloat(rows[0].ctr).toFixed(2).toString();
        this.positionThisYear = parseFloat(rows[0].position).toFixed(2).toString();
        this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, campaignIndex, url);
      }
    }, error => {
      this.IsError = true;
      console.log("Please Login with your google account");
      // console.log('Data fetch failed for current year for URL : ' + this.selectedCampIdWebUrl + " --Error : - " + JSON.stringify(error.error));
    });

  }
  getDataPreviousYear(startDate, endDate, campaignIndex, url) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gscaccesstoken,
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

        this.clicksPreviousYear = rows[0].clicks;
        this.impressionsPreviousYear = rows[0].impressions;
        this.cTRPreviousYear = parseFloat(rows[0].ctr).toFixed(2).toString();
        this.positionPreviousYear = parseFloat(rows[0].position).toFixed(2).toString();
        let diff1 = this.impressionsThisYear - this.impressionsPreviousYear
        if (diff1 > 0) { this.impressionPve = this.impressionPve + 1; }
        if (diff1 < 0) { this.impressionNve = this.impressionNve + 1; }
        if (diff1 == 0) { this.impressionNute = this.impressionNute + 1; }
        this.pieChartData4 = [this.impressionPve.toString(), this.impressionNve.toString(), this.impressionNute.toString()];
        this.campaignList[campaignIndex].gsc = this.impressionsPreviousYear + "--" + this.impressionsThisYear;
        this.tableData = this.campaignList;
        this.source = new LocalDataSource(this.campaignList)

      }
    }, error => {
      //this.campaignList[campaignIndex].gsc = "0%";
      console.log('Data fetch failed for previous year for URL : ' + this.selectedCampIdWebUrl + " --Error : - " + JSON.stringify(error.error));
    });
  }

  getData(campaignIndex, gscurl) {
    if (this.gaaccesstoken == '' || this.gaaccesstoken == undefined || this.gaaccesstoken == null) {
      console.log("Please, Login with Google to fetch data");
    } else if (parseDate(this.endDate) < parseDate(this.startDate)) {
      console.log("Start Date can not be grater then End Date");
    }
    else {
      let urlcamp = gscurl.replace('https://', '');
      urlcamp = urlcamp.replace('/', '');
      const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2F" + urlcamp + "/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
      this.getDataCurrentYear(this.startDate, this.endDate, url, campaignIndex);
     
    }
  }
  refreshGSCAccount(campaignIndex, refreshToken, gscurl) {

    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {

        this.gscaccesstoken = res['access_token'];
        this.getData(campaignIndex, gscurl);
      }
    }, error => {
      alert('eeee : ' + JSON.stringify(error.error));
    });
  }
  //###############################################Facebook data
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

  thOptions(i) {
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
  //###############################################Google Analytics

  refreshGoogleAnalyticsAccount(campaignIndex, refreshToken, gaUrl) {
    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: refreshToken,// 'ya29.a0AfH6SMCszj8kAk7Q4lV43Q0vsJWDKmmmYkSYnwPclmY1La7BesHF7-5KuwdX1s4MlllQafsCGCjmQ9oO3K4jtFB6wMvDiuWjRsYpGQxkKzpwoUvph8e5OWG_Fy0bCUYAe_NiJ0x8gUkhM98seOhBPvNE1znZ',
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {

        this.gaaccesstoken = res['access_token'];
        this.getAnalyticsProfileIds(campaignIndex, gaUrl);
      }
    }, error => {
      alert('eeee : ' + JSON.stringify(error.error));
    });

  }
  getAnalyticsProfileIds(campaignIndex, url) {


    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    const url1 = "https://www.googleapis.com/analytics/v3/management/accountSummaries";
    this.http.get(url1, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['items'];
        //let accountSummaryIds=[];
        for (let i = 0; i < rows.length; i++) {

          let p = rows[i]
          let q = p['webProperties']['0'].websiteUrl.toString();

          if (q.includes(url)) {
            this.getAnalyticsOrganicTrafficThisMonth(rows[i].webProperties[0].profiles[0].id, campaignIndex);
           
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
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + this.startDate + "&end-date=" + this.endDate + "&metrics=ga%3AorganicSearches%2Cga%3AgoalConversionRateAll";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        this.thisMonthTraffic = rows[0]["0"];
        this.thisMonthConversions = rows[0]["1"];
        this.getAnalyticsOrganicTrafficLastMonth(profileid, campaignIndex);
      }
    }, error => {
      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsOrganicTrafficLastMonth(profileid, campaignIndex) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + this.previousStartDate + "&end-date=" + this.previousEndDate + "&metrics=ga%3AorganicSearches%2Cga%3AgoalConversionRateAll";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        let rows = res['rows'];
        //Traffic Calculation
        this.lastMonthTraffic = rows[0]["0"];
        // let perTraffic = this.getDifference(this.lastMonthTraffic, this.thisMonthTraffic);
        // if (parseFloat(perTraffic) > 0) { this.trafficPve = this.trafficPve + 1; }
        // if (parseFloat(perTraffic) < 0) { this.trafficNve = this.trafficNve + 1; }
        // if (parseInt(perTraffic) == 0) { this.trafficNut = this.trafficNut + 1; }
        // this.trafficPvePer = this.getPercentage(this.trafficPve, this.total);
        // this.trafficNvePer = this.getPercentage(this.trafficNve, this.total);
        // this.trafficNutPer = this.getPercentage(this.trafficNut, this.total);
        let diff = this.thisMonthTraffic - this.lastMonthTraffic
        if (diff > 0) { this.trafficPve = this.trafficPve + 1; }
        if (diff < 0) { this.trafficNve = this.trafficNve + 1; }
        if (diff == 0) { this.trafficNut = this.trafficNut + 1; }

        this.pieChartData2 = [this.trafficPve.toString(), this.trafficNve.toString(), this.trafficNut.toString()];
        //Converssions calculation for chart
        this.lastMonthConversions = rows[0]["1"];
        // let perConversions = this.getDifference(this.lastMonthConversions, this.thisMonthConversions);
        // if (parseFloat(perConversions) > 0) { this.ConversionsPve = this.ConversionsPve + 1; }
        // if (parseFloat(perConversions) < 0) { this.ConversionsNve = this.ConversionsNve + 1; }
        // if (parseInt(perConversions) == 0) { this.ConversionsNut = this.ConversionsNut + 1; }
        // this.ConversionsPvePer = this.getPercentage(this.ConversionsPve, this.total);
        // this.ConversionsNvePer = this.getPercentage(this.ConversionsNve, this.total);
        // this.ConversionsNutPer = this.getPercentage(this.ConversionsNut, this.total);
        let diff1 = this.thisMonthConversions - this.lastMonthConversions
        if (diff1 > 0) { this.ConversionsPve = this.ConversionsPve + 1; }
        if (diff1 < 0) { this.ConversionsNve = this.ConversionsNve + 1; }
        if (diff1 == 0) { this.ConversionsNut = this.ConversionsNut + 1; }
        this.pieChartData3 = [this.ConversionsPve.toString(), this.ConversionsNve.toString(), this.ConversionsNut.toString()];

        this.campaignList[campaignIndex].traffic = this.lastMonthTraffic + "--" + this.thisMonthTraffic;
        this.tableData = this.campaignList;
        this.source = new LocalDataSource(this.campaignList)
      }
    }, error => {

      alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }

  //###############################################/general functions
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
  resetChartVariables() {
    //Ranking
    this.pve = 0;
    this.nve = 0;
    this.nut = 0;
    //impressin
    this.impressionNve = 0;
    this.impressionPve = 0;
    this.impressionNute = 0;
    //conversion
    this.ConversionsNve = 0;
    this.ConversionsPve = 0;
    this.ConversionsNut = 0;
    //traffic
    this.trafficNut = 0;
    this.trafficNve = 0;
    this.trafficPve = 0;
  }
  private handleError(error) {
    console.error('Error processing action', error);
  }
  getPercentage(num, total) {
    return ((100 * num) / total)
  }
  public getCampaignList(): void {
    
    this.resetChartVariables();
    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;

      for (let i = 0; i < res.length; i++) {
        let ga = this.CampaignGAList.filter(x => x.campaignID == res[i].id);
        if (ga != null && ga != undefined && ga.length > 0) {
          
         this.refreshGoogleAnalyticsAccount(i, ga[0]['refreshToken'], ga[0]['urlOrName']);
        }
        let gsc = this.CampaignGSCList.filter(x => x.campaignID == res[i].id);
        if (gsc != null && gsc != undefined && gsc.length > 0) {
          this.refreshGSCAccount(i, gsc[0]['refreshToken'], gsc[0]['urlOrName']);
        }
        let facebook = this.CampaignFacebookList.filter(x => x.campaignID == res[i].id);
        if (facebook != null && facebook != undefined && facebook.length > 0) {

        }

        this.GetRankingPosition(res[i].id);

        this.campaignList[i].ranking = this.rankingPrev + "--" + this.rankingThis;
      }
      this.source = new LocalDataSource(this.campaignList);
    });
  }
  sortData(p) {
    return p.sort((a, b) => {
      return <any>new Date(b.createdOn) - <any>new Date(a.createdOn);
    });
  }
  onStartDateChange(event) {

    this.getDateDiff();
    this.getCampaignList();
  }
  onEndDateChange(event) {
    this.getDateDiff();
    this.getCampaignList();
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
  }
  getYearwiseDifference(previous, current) {

    let diff = ((parseFloat(previous) - parseFloat(current)) * 100) / parseFloat(previous)
    return parseFloat(diff.toString()).toFixed(2)

  }
  //Ranking Data
  public getSerpList(): void {
    this.campaignService.getSerp("&tbs=qdr:m").subscribe(res => {
      this.serpList = res;
      this.tempSerpList = this.serpList;
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
  testFunction() {
    this.campaignService.GetUpdateKeywordsStatus().subscribe(
      res => {
        if (res) {
          console.log(res);
        }

      }
    )
  }
  onCustomAction(event) {
    switch (event.action) {
      case 'editCampaign':
        ;
        this.editCampaign(event.data);
        break;
      case 'deleteCampaign':
        this.deleteCampaign(event.data);
        break;
    }
  }
  editCampaign(campaign: any) {
    
    localStorage.setItem('editMasterId', campaign.id);
    localStorage.setItem('selectedCampName', campaign.name);
    localStorage.setItem('selectedCampUrl', campaign.webUrl);
    this.SelectedCampaignId = campaign.id;
    let ga = this.CampaignGAList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (ga != null && ga != undefined && ga.length > 0) {
      localStorage.setItem('gaurl', ga[0]['urlOrName']);
      localStorage.setItem('gaaccesstoken', ga[0]['accessToken']);
    }
    let gads = this.CampaignGAdsList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (gads != null && gads != undefined && gads.length > 0) {
      localStorage.setItem('gadsurl', gads[0]['urlOrName']);
      localStorage.setItem('gadsaccesstoken', gads[0]['accessToken']);
    }
    let facebook = this.CampaignFacebookList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (facebook != null && facebook != undefined && facebook.length > 0) {
      localStorage.setItem('facebookpagename', facebook[0]['urlOrName']);
      localStorage.setItem('facebookaccesstoken', facebook[0]['accessToken']);
    }
    let gsc = this.CampaignGSCList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (gsc != null && gsc != undefined && gsc.length > 0) {
      localStorage.setItem('gscurl', gsc[0]['urlOrName']);
      localStorage.setItem('gscaccesstoken', gsc[0]['accessToken']);
    }
    this.router.navigate(['/home/campaign']);
  }
  deleteCampaign(event) {
    success({
      icon: this.translate.instant('sweetalert.WARNINGICON'),
      title: this.translate.instant('message.DELETEMSG'),
      buttons: {
        cancel: {
          text: this.translate.instant('sweetalert.CANCELBUTTON'),
          value: null,
          visible: true,
          className: "",
          closeModal: false
        },
        confirm: {
          text: this.translate.instant('sweetalert.CONFIRMBUTTON'),
          value: true,
          visible: true,
          className: "bg-danger",
          closeModal: false
        }
      }
    }).then((isConfirm: any) => {
      if (isConfirm) {
        this.campaignService.deleteCampaignById(event.id).subscribe(res => {

          success({
            icon: this.translate.instant('sweetalert.WARNINGICON'),
            title: this.translate.instant('message.DELETEMSG'),
            buttons: {
              confirm: {
                text: this.translate.instant('sweetalert.OKBUTTON'),
                value: true,
                visible: true,
                className: "bg-primary",
                closeModal: true,
              }
            }
          }).then((isConfirm) => {
            if (isConfirm) {
              window.location.reload();
            }
          })
        });
      } else {
        success({
          icon: this.translate.instant('sweetalert.WARNINGICON'),
          title: this.translate.instant('message.CANCLEMSG'),
          buttons: {
            confirm: {
              text: this.translate.instant('sweetalert.OKBUTTON'),
              value: true,
              visible: true,
              className: "bg-primary",
              closeModal: true,
            }
          }
        }).then((isConfirm) => { })
      }
    });
  }
  instagramapp() {
    localStorage.setItem("isinsta", "1");
    const url = "https://api.instagram.com/oauth/authorize?ccess_type=offline&prompt=consent&client_id=1381661432190657&redirect_uri=https://localhost:4200/home&scope=user_profile,user_media&response_type=code";
    window.location.href = url;
    // let data = {};
    // data = {
    //   client_id: environment.googleClientId,
    //   client_secret: environment.googleClientSecret,
    //   refresh_token: refreshToken,
    //   grant_type: 'refresh_token',
    //   access_type: 'offline'
    // };
    // this.http.post(url, data).subscribe(res => {
    //   if (res) {

    //     this.gscaccesstoken = res['access_token'];
    //     this.getData(campaignIndex, gscurl);
    //   }
    // }, error => {
    //   alert('eeee : ' + JSON.stringify(error.error));
    // });
  }
}
