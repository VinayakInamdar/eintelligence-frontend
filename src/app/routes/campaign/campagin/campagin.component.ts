import { Component, OnInit, Directive, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { LocalDataSource } from 'ng2-smart-table';
import { ChartDataSets, ChartOptions, ChartScales } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { IntegrationsService } from '../../integrations/integrations.service';
import { OverviewService } from '../../overview/overview.service';
import { PlatformLocation } from '@angular/common';
import { AuditsService } from '../../audits/audits.service';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { parseDate } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { FacebookService, LoginOptions, LoginResponse } from 'ngx-facebook';
const success = require('sweetalert');

@Component({
  selector: 'app-campagin',
  templateUrl: './campagin.component.html',
  styleUrls: ['./campagin.component.scss']
})
@Directive({ selector: '[ng2FileSelect]' })

export class CampaginComponent implements OnInit, AfterViewInit {
  profiles: any;
  selectedProfile: any;
  isEditMode: boolean = false;
  //#############################################
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
  gaAccaessToken;
  gscAccessToken;
  gaRefreshToken;
  gscRefreshToken;
  facebookRefreshToken;

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
  gaSelect = new FormControl();
  gscSelect = new FormControl();
  myForm = new FormGroup({
    fromDate: this.fromDate,
    toDate: this.toDate
  });
  gaSelectForm = new FormGroup({
    gaSelect: this.gaSelect,
    gscSelect: this.gscSelect
  });
 
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
  public pieChartLabels2 = ['Positive', 'Negative', 'Neutral'];
  public pieChartData2 = ['75', '36', '55'];
  public pieChartType2 = 'pie';
  public pieOptions2 = {
    legend: {
      display: false
    }
  };
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
  campaignList = [];
  selectedCampIdWebUrl: string;
  selectedCampaignName: string;
  companyId;
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
  tableData: Campaign[];
  total;
  //################################################
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild(BaseChartDirective)
  rankingGraphData;
  barDataArray: any[] = [];
  public chart: BaseChartDirective;
  valForm: FormGroup;
  public campaignModel: Campaign;
  edit: boolean;
  public value: any = {};
  easyPiePercent1: number = 85;
  radius = 54;
  progressvalue: number = 75;
  sitespeedCircularProgressouterStrokeColorDesktop: string;
  sitespeedCircularProgressouterStrokeColorMobile: string;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number = 50;
  progressDesktop = 69;
  progressMobile = 45;
  pieOptions1 = {
    animate: {
      duration: 800,
      enabled: true
    },

    barColor: '#008FFB',
    trackColor: false,
    scaleColor: false,
    lineWidth: 10,
    lineCap: 'circle'
  };
  doughnutData = {
    labels: [
      'Purple',
    ],
    datasets: [{
      data: [30]
    }]
  };

  doughnutColors = [{
    borderColor: [
      'rgba(12, 162, 235, 0.2)',
    ],
    backgroundColor: [
      'rgba(12, 162, 235, 0.2)',
    ],
  }];

  doughnutOptions = {
    responsive: true
  };
  sub: Subscription;
  id: number;
  public demo1TabIndex = 0;
  //public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  url: string;
  trafficsourcedate: { display: any[]; medium: any[]; referral: any[]; social: any[]; source: any[]; };
  gaAccounts = [];
  gscAccounts = [];
  facebookAccounts = [];
  hasGaSetup: boolean = false;
  hasFacebookSetup: boolean = false;
  hasGscSetup: boolean = false;
  hasGadsSetup: boolean = false;
  gaSelectedName;
  facebookSelectedName;
  gscSelectedName;
  gadsSelectedName;
  masterCampaignId;
  showSpinnerBaseChart: boolean = true;
  showSpinnerSiteAnalysisContent: boolean = true;
  googleAnalyticsAccountSetupList: GoogleAnalyticsAccountSetups[];
  activeAccount: any;
  hasActiveAccount: boolean = false;
  authorizeGaAccounts: any;
  hasAuthorize: boolean;
  reportsData: any;
  settings = {
    defaultStyle: false,
    attr: {
      class: 'table table-responsive',

    },
    //actions: { add: false, edit: { confirmSave: true }, delete: false },
    actions: {
      columnTitle: '',
      custom: [{ name: 'editCampaign', title: '<i class="fas fa-edit"></i>' },
      { name: 'deleteCampaign', title: '<span class="text-danger col" style="padding-left:1rem"><i class="fas fa-trash-alt"></i></span>' }],
      add: false, edit: false, delete: false, position: 'right'
    },
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
  bsValue = new Date();
  date = new Date();
  //startDate = new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split("T")[0]; 
  queryParams: any;
  setCurrentSettingActive: number;
  selectedCampaignTaskId: string;
  securitySection: { ssl: any; sslcertificate: any; have_sitemap: any; have_robots: any; };

  // endDate = new Date().toISOString().split("T")[0];
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  ranges = [{
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
    label: 'Last 7 Days'
  }, {
    value: [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()],
    label: 'Last 30 Days'
  }, {
    value: [new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1), new Date(this.date.getFullYear(), this.date.getMonth() - 1, 31)],
    label: 'Last Month'
  }, {
    value: [new Date(this.date.getFullYear(), this.date.getMonth(), 1), new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)],
    label: 'This Month'
  },
  {
    value: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))],
    label: 'Next 7 Days'
  }];
  dateLabels: any;
  selectedLabel: number = 0;
  selctedLabelName: string = 'Sessions';
  selectedLabelValue: string = 'sessions'
  selectedLabel1: number;
  selctedLabelName1: string = 'Select Matrix';
  selectedLabelValue1: string;
  httpOptionJSON1 = {
		headers: new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded',
		})
	};

  showdiv: boolean = false;
  show: string = 'undefine';
  bsInlineRangeValue: Date[];
  acqusitionsubmenu: boolean = false;
  audiencesubmenu: boolean = false;
  behaviorsubmenu: boolean = false;
  conversionsubmenu: boolean = false;
  settingActive: number = 2;
  gaurl;
  facebookpagename;
  gscurl;
  gaid;
  gscid;
  facebookid;
  gacode;
  gsccode;
  webUrlReg:string='([^https://www.]|[^www.]|[^http://www.])[a-zA-Z]{4,}(([\.][a-z]{3})|([\.][a-z]{2}[\.][a-z]{2}))';
  constructor(private translate: TranslateService, fb: FormBuilder, private facebook: FacebookService,
    private campaignService: CampaignService, private authService: SocialAuthService,
    public route: ActivatedRoute, public http: HttpClient, public datepipe: DatePipe, public router: Router, private openIdConnectService: OpenIdConnectService, private integrationsService: IntegrationsService
    , private overvieswService: OverviewService, location: PlatformLocation, private snackbarService: SnackbarService,
    public auditsService: AuditsService) {
     
    facebook.init({
      appId: '200487178533939',//environment.facebook_appid,//3574916862576976
      version: 'v9.0'
    });
    this.hasGaSetup = false;
    this.campaignModel = new Campaign();
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    // this.getGaSetupByCampaignId();

    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    if (this.route.snapshot.queryParams.view !== undefined) {
      this.checkqueryparams();
    }
    this.getCampaignList();
    this.getSerpList();
    location.onPopState(() => {


    });

    
    this.valForm = fb.group({
      'name': [this.campaignModel.name, Validators.required],
      'campaignType': [''],
      //'webUrl': [this.campaignModel.webUrl, [Validators.required, Validators.pattern('[a-zA-Z]{4,}[\.][a-z]{2,4}')]],
      'webUrl': [this.campaignModel.webUrl, [Validators.required, Validators.pattern(this.webUrlReg)]],

      'moreTraffic': [true],
      'sales': [true],
      'leadGeneration': [true],
    })
    this.gacode = localStorage.getItem("gacode");
    if(this.gacode != 'null' && this.gacode != null && this.gacode != undefined && this.gacode != ''){
      this.getToken(this.gacode);
    }
    this.gsccode = localStorage.getItem("gsccode");
    if(this.gsccode != 'null' && this.gsccode != null && this.gsccode != undefined && this.gsccode != ''){
      this.getToken(this.gsccode);
    }
   
  }
 	getToken(code) {
     debugger
		const url = "https://oauth2.googleapis.com/token";
     
		//const url = "https://www.googleapis.com/oauth2/v4/token";
		const body = new URLSearchParams();
		body.set('client_id', environment.googleClientId);
		body.set('client_secret', environment.googleClientSecret);
		body.set('code', code);
		body.set('grant_type', 'authorization_code');
		body.set('redirect_uri', environment.googleRedirectUrl);
		this.http.post(url, body.toString(), this.httpOptionJSON1).subscribe(res => {
			if (res) {
        debugger
        if(this.gacode != 'null' && this.gacode != null && this.gacode != undefined && this.gacode != ''){
        this.staticTabs.tabs[2].disabled = false;
        this.staticTabs.tabs[2].active = true;
         this.gaAccaessToken = res['access_token'];
         this.gaRefreshToken = res['refresh_token'];
         this.getAnalyticsProfileIds2();
        localStorage.setItem("gacode",'');
        this.gacode ='';
        }
        if(this.gsccode != 'null' && this.gsccode != null && this.gsccode != undefined && this.gsccode != ''){
          this.staticTabs.tabs[2].disabled = false;
          this.staticTabs.tabs[2].active = true;
          this.gscAccounts = [];
          this.hasGscSetup = true;
          this.gscAccessToken = res['access_token'];
          this.gscRefreshToken = res['refresh_token'];
          this.getGSCSiteList();
          localStorage.setItem("gsccode",'');
          this.gsccode ='';
          }
			}
		}, error => {
			console.log(error.message, 'Error');
		});
	}
  checkqueryparams() {
    var params = { ...this.route.snapshot.queryParams };
    this.queryParams = params.view
    delete params.view;
    this.router.navigate([], { queryParams: params });
    this.settingActive = 3;
  }
  ngAfterViewInit(): void {
    this.url = this.router.url
    if (this.url.includes('/home/campaign')) {
      this.settingActive = 1;
      setTimeout(() => {
        this.disableTab()
      }, 500);
    }
    // using to disable tab , user have to go step by step 
    // this.disableTab()
  }


  ngOnInit(): void {
  debugger
    this.masterCampaignId = localStorage.getItem('masterCampaignId');
    if (this.masterCampaignId != null && this.masterCampaignId != undefined) {
      this.settingActive = 1;
    }
    let editMasterId = localStorage.getItem('editMasterId')
    if (editMasterId != "null" && editMasterId != undefined  && editMasterId != '') {
      this.isEditMode = true;
      this.masterCampaignId = editMasterId;
      this.valForm.controls['name'].setValue(localStorage.getItem('selectedCampName'));
      this.valForm.controls['webUrl'].setValue(localStorage.getItem('selectedCampUrl'));
      this.facebookAccessToken = localStorage.getItem('facebookaccesstoken');
      this.gscAccessToken = localStorage.getItem('gscaccesstoken');
      this.gaAccaessToken = localStorage.getItem('gaaccesstoken')
      this.gaRefreshToken = localStorage.getItem('garefreshtoken')
      this.gscRefreshToken = localStorage.getItem('gscrefreshtoken')
      this.gaid =  localStorage.getItem('gaid')
      this.gaurl = localStorage.getItem('gaurl');
      this.gscid =  localStorage.getItem('gscid')
      this.facebookid =  localStorage.getItem('facebookid')
      this.facebookpagename = localStorage.getItem('facebookpagename');
      this.gscurl = localStorage.getItem('gscurl');
      if (this.gaurl != 'null' && this.gaurl != null && this.gaurl != undefined && this.gaurl != '') {
        this.refreshGoogleAnalyticsAccount();
      //if(this.gaAccaessToken != 'null' && this.gaAccaessToken != null && this.gaAccaessToken != undefined && this.gaAccaessToken != ''){
        this.hasGaSetup = true;
       // this.getAnalyticsProfileIds2();
      }
      if (this.gscurl != 'null' && this.gscurl != null && this.gscurl != undefined && this.gscurl != '') {
     // if(this.gscAccessToken != 'null' && this.gscAccessToken != null && this.gscAccessToken != undefined && this.gscAccessToken != ''){
      this.refreshGSCAccount();
        this.hasGscSetup=true;
        //this.getGSCSiteList();
      }
      if(this.facebookAccessToken != 'null' && this.facebookAccessToken != null && this.facebookAccessToken != undefined && this.facebookAccessToken != ''){
        this.hasFacebookSetup = true;
        this.getFacebookPagesList();
      }
    }

    this.companyId = localStorage.getItem('companyID');
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    //Traffic
    this.trafficPvePer = 0;
    this.trafficNvePer = 0;
    this.trafficNutPer = 0;
    this.trafficPve = 0;
    this.trafficNve = 0;
    this.trafficNut = 0;
  }
  refreshGSCAccount() {
    debugger
    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: this.gscRefreshToken,//'ya29.a0AfH6SMCszj8kAk7Q4lV43Q0vsJWDKmmmYkSYnwPclmY1La7BesHF7-5KuwdX1s4MlllQafsCGCjmQ9oO3K4jtFB6wMvDiuWjRsYpGQxkKzpwoUvph8e5OWG_Fy0bCUYAe_NiJ0x8gUkhM98seOhBPvNE1znZ',
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {
        debugger
        this.gscAccessToken = res['access_token'];
        this.getGSCSiteList();
      }
    }, error => {
      alert('eeee : ' + JSON.stringify(error.error));
    });
  }
  refreshGoogleAnalyticsAccount() {
    debugger
    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: this.gaRefreshToken,// 'ya29.a0AfH6SMCszj8kAk7Q4lV43Q0vsJWDKmmmYkSYnwPclmY1La7BesHF7-5KuwdX1s4MlllQafsCGCjmQ9oO3K4jtFB6wMvDiuWjRsYpGQxkKzpwoUvph8e5OWG_Fy0bCUYAe_NiJ0x8gUkhM98seOhBPvNE1znZ',
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {
        debugger
        this.gaAccaessToken = res['access_token'];
        this.getAnalyticsProfileIds2();
      }
    }, error => {
      alert('eeee : ' + JSON.stringify(error.error));
    });

  }
  editCampaign(campaign: any) {
    this.selectedCampId = campaign.id
    this.settingActive = 4;
    this.campaignService.getcampaign(this.selectedCampId).subscribe(res => {
      this.campaignModel = res;
    });
  }
  onCustomAction(event) {
    switch (event.action) {
      case 'editCampaign':
        this.editCampaign(event.data);
        break;
      case 'deleteCampaign':
        this.deleteCampaign(event.data);
    }
  }
  // using to check Integration Status of selected campaign Id
  goToOverview(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    this.router.navigate(['/integrations', this.selectedCampId]);
  }

 
  // using to get list of campaigns
  public getCampaignList(): void {
    var userid = localStorage.getItem("userID");

    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      this.source = new LocalDataSource(this.campaignList)
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
      //this.getSelectedCampaignWebsiteAuditReportData()
    });
  }

  //using to get seleted campaign website audit report data
  public getSelectedCampaignWebsiteAuditReportData() {
    this.changeCircularProgressOuterStrokeColor()
    // using to get list of audits
    this.auditsService.getAudits().subscribe(res => {
      var selectedCampTaskId = res.filter((s, i) => {
        var site = s['websiteUrl']
        if (this.selectedCampIdWebUrl.includes(site) == true && site != undefined) {
          return s.taskId
        }
      })

      if (selectedCampTaskId[0]) {
        var taskId = selectedCampTaskId[0].taskId;
        this.selectedCampaignTaskId = taskId.toString()
        this.auditsService.getOnPageData(this.selectedCampaignTaskId).subscribe(res => {
          var technical_seo = {}
          var on_page_seo = {}
          res['summary'].map((s, i) => {
            this.securitySection = {
              ssl: s.ssl,
              sslcertificate: s.ssl_certificate_valid,
              have_sitemap: s.have_sitemap,
              have_robots: s.have_robots
            }

          })
          this.showSpinnerSiteAnalysisContent = false;
        })
      }


    })
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

 
  // using to get list of keyword list
  public getSerpList(): void {
    this.campaignService.getSerp("&tbs=qdr:m").subscribe(res => {
      this.serpList = res;

    });
  }


  // using to  create new campaign in db
  submitForm(value: any) {
    
    if (this.isEditMode == false) {
      var result: Campaign = Object.assign({}, value);
      result.id = "00000000-0000-0000-0000-000000000000";
      //  result.profilePicture = this.fileToUpload.name
      ;
      this.campaignService.createCampaign(result).subscribe((res: Campaign) => {
        this.campaignModel = res;
        
        localStorage.setItem('masterCampaignId', res['id']);
        this.masterCampaignId = res['id'];
        this.staticTabs.tabs[2].disabled = false;
        this.staticTabs.tabs[2].active = true;
        //validation
        event.preventDefault();
        for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsTouched();
        }
        if (!this.valForm.valid) {
          return;
        }
      });
    } else if (this.isEditMode == true) {
      ;

      var result: Campaign = Object.assign({}, value);
      result.companyID = this.companyId;
      result.id = this.masterCampaignId;
      this.campaignService.updatecampaign(this.masterCampaignId, result).subscribe((res: Campaign) => {
        ;
        this.isEditMode = false;
        this.staticTabs.tabs[2].disabled = false;
        this.staticTabs.tabs[2].active = true;
        localStorage.setItem('editMasterId',null);
        this.valForm.reset();

      });
    }
  }

  // using to select nect tab
  goToNextTab(event, inputvalue, fieldName, tabid) {
    event.preventDefault()
    
    var value = this.validateForm(fieldName)
      this.staticTabs.tabs[tabid].disabled = false;
      this.staticTabs.tabs[tabid].active = true;
  }
  //using to go to next tab while edit
  goToNextTabForEdit(event, inputvalue, fieldName, tabid) {
    event.preventDefault()
    
    var value = this.validateForm(fieldName);
    this.staticTabs.tabs[tabid].disabled = false;
    this.staticTabs.tabs[tabid].active = true;
  }

  //Delete campaign
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
        ;
        this.campaignService.deleteCampaignById(event.id).subscribe(res => {
          ;
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
              this.router.navigate(['/home']);
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
        }).then((isConfirm) => {
          this.router.navigate(['/home']);
        })
      }
    });
  }

  // using to validate from 
  validateForm(fieldName) {
    
    if (this.valForm.invalid) {
      this.valForm.get(fieldName).markAsTouched();
      var value1 = this.valForm.controls[fieldName].status
      return value1;
    }
  }

  // using to go to previous tab
  goToPreviousTab(event, tabid) {
    event.preventDefault()
    this.staticTabs.tabs[tabid].active = true;
  }

  // using to disable tab , user have to go step by step 
  disableTab() {
    this.staticTabs.tabs[1].disabled = !this.staticTabs.tabs[1].disabled;
    this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled;
  }


  // using to open sweetalert to show success dialog
  successAlert() {
    success({
      icon: this.translate.instant('sweetalert.SUCCESSICON'),
      title: this.translate.instant('message.INSERTMSG'),
      buttons: {
        confirm: {
          text: this.translate.instant('sweetalert.OKBUTTON'),
          value: true,
          visible: true,
          className: "bg-primary",
          closeModal: true,
        }
      }
    }).then((isConfirm: any) => {

      if (isConfirm) {
        //this.router.navigate(['/campaign']);
      }
    });
  }
  //Campaign Update 
  updateSuccessAlert() {
    success({
      icon: this.translate.instant('sweetalert.SUCCESSICON'),
      title: this.translate.instant('message.UPDATEMSG'),
      buttons: {
        confirm: {
          text: this.translate.instant('sweetalert.OKBUTTON'),
          value: true,
          visible: true,
          className: "bg-primary",
          closeModal: true,
        }
      }
    }).then((isConfirm: any) => {
      if (isConfirm) {
        this.router.navigate(['/home']);
      }
    });
  }

  //using to check setup and get analytics data with selected campaign Id
  userRowSelect(campaign: any): void {

    this.selectedCampaignName = campaign.data.name
    this.selectedCampId = campaign.data.id
    //this.router.navigate(['/campaign', { id: campaign.data.id }])
    localStorage.setItem('selectedCampId', campaign.data.id);
    if (campaign.data.webUrl == '' || campaign.data.webUrl == null || campaign.data.webUrl == undefined) {
      this.router.navigate([`/socialmedia`])
    } else {
      this.router.navigate([`../campaign/:id${campaign.data.id}/seo`]);
      this.settingActive = 3
      this.selectedCampIdWebUrl = campaign.data.webUrl
      this.getSelectedCampaignWebsiteAuditReportData()
    }
  }




  // using to open create campaign view to add new campaign in db
  public onClick(event): any {
    this.setCurrentSettingActive = event.settingActive
    this.settingActive = 1
    setTimeout(() => {
      this.disableTab()
    }, 500);

  }
  public AddCampaign(): any {
    this.router.navigate(['/home/campaign']);
  }

  //using to open div on mouseover event
  public showDiv(event, value, show) {
    this.showdiv = value == 'true' ? true : false;
    this.show = show;

  }

  //using to view keyword list and also add new keyword
  goToKeywords(): void {
    this.router.navigate([`/campaign/:id${this.masterCampaignId}/seo/keywords`])
  }

  public goToAddKeywords(): void {
    
    this.router.navigate([`/campaign/:id${this.masterCampaignId}/seo/keywords`], {
      queryParams: {
        view: 'addKeyword'
      },
    })
  }

  // using to navigate to  overview page
  public goToCampaignOverview(event) {
    this.router.navigate(['/campaign', { id: this.selectedCampId }], {
      queryParams: {
        view: 'showReport'
      },
    });
  }



  public goToSeoOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo`])
  }
  public goToSocialMedia(event) {

    this.router.navigate([`./socialmedia/socialmedia`, { id: this.selectedCampId }])
  }
  public goToLinkedIn(event) {

    this.router.navigate([`./linkedin/linkedin`, { id: this.selectedCampId }])
  }
  public goToInstagram(event) {

    this.router.navigate([`./instagram/instagram`, { id: this.selectedCampId }])
  }
  public goToGSC(event) {

    this.router.navigate([`./gsc/gsc`, { id: this.selectedCampId }])
  }
  public closeCampaignComponent(event) {
    event.preventDefault()
    this.valForm.reset()
    this.router.navigate(['home'])
  }
  //using to close create campaign  component
  public closeCreateCampaignComponent(event) {
    event.preventDefault()
    this.settingActive = 3;
    this.valForm.reset()
    if (this.url.includes('/home/campaign')) {
      this.url = undefined;
      this.router.navigate(['home'])

    }


  }

  // using to change color of circulr progrss bar outerstroke accroding value
  public changeCircularProgressOuterStrokeColor() {

    // for desktop speed
    if (this.progressDesktop > 0 && this.progressDesktop <= 50) {
      this.sitespeedCircularProgressouterStrokeColorDesktop = '#D32F2F'
    }
    else if (this.progressDesktop > 50 && this.progressDesktop <= 80) {
      this.sitespeedCircularProgressouterStrokeColorDesktop = '#FF6312'
    }
    else {
      this.sitespeedCircularProgressouterStrokeColorDesktop = '#148B39'
    }

    // for mobile speed
    if (this.progressMobile > 0 && this.progressMobile <= 50) {
      this.sitespeedCircularProgressouterStrokeColorMobile = '#D32F2F'
    }
    else if (this.progressMobile > 50 && this.progressMobile <= 80) {
      this.sitespeedCircularProgressouterStrokeColorMobile = '#FF6312'
    }
    else {
      this.sitespeedCircularProgressouterStrokeColorMobile = '#148B39'
    }
  }

  onStartDateChange(event) {
    this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.currYear = parseInt(this.datepipe.transform(this.fromDate.value, 'yyyy'));
    let prevYear = this.currYear - 1;
    this.previousStartDate = prevYear.toString() + '-' + this.datepipe.transform(this.fromDate.value, 'MM-dd');

  }

  onEndDateChange(event) {
    this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
    this.currYear = parseInt(this.datepipe.transform(this.toDate.value, 'yyyy'));
    let prevYear = this.currYear - 1;
    this.previousEndDate = prevYear.toString() + '-' + this.datepipe.transform(this.toDate.value, 'MM-dd');

  }

  integrateGoogleAnalytics(): void {
    localStorage.setItem("isga","1");
    //let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly&access_type=offline&include_granted_scopes=true&redirect_uri='+environment.googleRedirectUrl+'&response_type=code&client_id=' + environment.googleClientId;
    let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics&access_type=offline&prompt=consent&include_granted_scopes=true&redirect_uri='+environment.googleRedirectUrl+'&response_type=code&client_id=' + environment.googleClientId;

		  //let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&access_type=offline&include_granted_scopes=true&redirect_uri='+environment.googleRedirectUrl+'&response_type=code&client_id=' + environment.googleClientId;

    //let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile&access_type=offline&include_granted_scopes=true&redirect_uri=https://localhost:4200/home/campaign&response_type=code&client_id=' + environment.googleClientId;
    window.location.href = connectYouTubeUrl;
    // debugger
    // this.campaignService.authGoogleRestSharp("fdgdfg").subscribe(
    //   res => {
    //     debugger
    //       let p = res;
    //  }); 
   // this.refreshGSCAccount1();
  //  this.integrationsService.googleAuth(this.masterCampaignId).subscribe(
  //     res => {
  //       debugger
  //         let p = res;
  //        this.gaAccaessToken = res['accessToken'];
  //        this.gaRefreshToken = res['refreshToken'];
  //        this.getAnalyticsProfileIds2();
  //    });  
    // const googleLoginOptions = {
    //   connection: 'google-oauth2',
    //   prompt: 'consent',
    //   connection_scope: 'https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/yt-analytics.readonly',
    //   // scope: 'openid profile',
    //   accessType: 'offline',
    //   //approvalPrompt: 'force',
    //   scope: 'openid profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit'
    // };
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
    //   .then((res) => {
    //     debugger
    
    //     this.gaAccaessToken = res['authToken'];
    //     this.getAnalyticsProfileIds2();
    //   })
  }


  onSelectGa(id) {
    
    this.gaSelectedName = id;
  }
  saveGaAccount() {
  debugger
    if(!this.isEditMode){
    let data = {
      id: "00000000-0000-0000-0000-000000000000",
      urlOrName: this.gaSelectedName,
      isActive: true,
      CampaignID: this.masterCampaignId,
      accessToken: this.gaAccaessToken,
      refreshToken: this.gaRefreshToken
    }
    this.campaignService.createGA(data).subscribe(
      res => {
        this.successAlert()
      });
    }
    if(this.isEditMode){
      if(this.gaid == null || this.gaid ==undefined ||this.gaid =='null' ||this.gaid ==''){
        let data = {
          id: "00000000-0000-0000-0000-000000000000",
          urlOrName: this.gaSelectedName,
          isActive: true,
          CampaignID: this.masterCampaignId,
          accessToken: this.gaAccaessToken,
          refreshToken: this.gaRefreshToken
        }
        this.campaignService.createGA(data).subscribe(
          res => {
            this.successAlert()
          });
    }else{
      let data = {
        id: this.gaid,
        urlOrName: this.gaSelectedName,
        isActive: true,
        CampaignID: this.masterCampaignId,
        accessToken: this.gaAccaessToken,
        refreshToken: this.gaRefreshToken
      }
      this.campaignService.updateGA(this.gaid, data).subscribe(response => {
        debugger
        this.successAlert();
      });
    }
  }
  }
  
  getAnalyticsProfileIds2() {
    
    this.gaAccounts = [];
    this.hasGaSetup = true;
    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaAccaessToken,
      })
    };
    const url = "https://www.googleapis.com/analytics/v3/management/accountSummaries";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        
        let rows = res['items'];
        //let accountSummaryIds=[];
        for (let i = 0; i < rows.length; i++) {

          let p = rows[i]
          let q = p['webProperties']['0'].websiteUrl.toString();
          this.gaAccounts.push(q);
          // accountSummaryIds.push(rows[i].webProperties[0].profiles[0].id);
        }
        
        this.gaSelectForm.controls['gaSelect'].setValue(this.gaurl, {onlySelf: true});
        this.gaSelectedName = this.gaurl;
      }
    }, error => {

      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }

  integrateGSC(): void {
    localStorage.setItem("isgsc","1");
    let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters&access_type=offline&prompt=consent&include_granted_scopes=true&redirect_uri='+environment.googleRedirectUrl+'&response_type=code&client_id=' + environment.googleClientId;
    window.location.href = connectYouTubeUrl;
    //  this.integrationsService.refreshGoogleAccount("ewwerwerwe",this.gaAccaessToken).subscribe(
    //   res => {
    //     debugger
    //       let p = res;
    //       this.gscAccounts = [];
    //      this.hasGscSetup = true;
    //      this.gscAccessToken = res['accessToken'];
    //      this.gscRefreshToken = res['refreshToken'];
    //      this.getGSCSiteList();
    //  });  
    //this.integrationsService.googleAuth(this.masterCampaignId).subscribe(
    //   res => {
    //     debugger
    //       let p = res;
    //       this.gscAccounts = [];
    //      this.hasGscSetup = true;
    //      this.gscAccessToken = res['accessToken'];
    //      this.gscRefreshToken = res['refreshToken'];
    //      this.getGSCSiteList();
    //  });  
    // const googleLoginOptions = {
    //   connection: 'google-oauth2',
    //   scope: 'profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit',
    //   accessType: 'offline',
    //   //approvalPrompt: 'force',
    //     access_type : 'offline',
    //   prompt: 'consent'
    // };
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
    //   .then((res) => {
        
    //     this.gscAccounts = [];
    //     this.hasGscSetup = true;
    //     this.gscAccessToken = res['authToken'];
        
    //     this.getGSCSiteList();
    //   })
  }
  onSelectGsc(id) {
    
    this.gscSelectedName = id;
  }

  saveGscAccount() {
    debugger
    if(!this.isEditMode){
    let data = {
      id: "00000000-0000-0000-0000-000000000000",
      urlOrName: this.gscSelectedName,
      isActive: true,
      CampaignID: this.masterCampaignId,
      accessToken: this.gscAccessToken,
      refreshToken: this.gscRefreshToken
    }
    this.campaignService.createGSC(data).subscribe(
      res => {
        this.successAlert()
      });
    }
    if(this.isEditMode){
      if(this.gscid = null || this.gscid ==undefined ||this.gscid =='null' ||this.gscid ==''){
        let data = {
          id: "00000000-0000-0000-0000-000000000000",
          urlOrName: this.gscSelectedName,
          isActive: true,
          CampaignID: this.masterCampaignId,
          accessToken: this.gscAccessToken,
          refreshToken: this.gscRefreshToken
        }
        this.campaignService.createGSC(data).subscribe(
          res => {
            this.successAlert()
          });
      }else{
      let data = {
        id: this.gaid,
        urlOrName: this.gaSelectedName,
        isActive: true,
        CampaignID: this.masterCampaignId,
        accessToken: this.gaAccaessToken,
        refreshToken: this.gaRefreshToken
      }
      this.campaignService.updateGSC(this.gscid, data).subscribe(response => {
        debugger
        this.successAlert();
      });
    }


    }
  }
  onSelectGads(id) {
    
    this.gadsSelectedName = id;
  }
  saveGadsAccount() {
    
    let data = {
      id: "00000000-0000-0000-0000-000000000000",
      urlOrName: this.gadsSelectedName,
      isActive: true,
      CampaignID: this.masterCampaignId,
      accessToken: this.accessToken,
      refreshToken: '1111'
    }
    this.campaignService.createGAds(data).subscribe(
      res => {
        
        this.successAlert()
      });
  }
  onSelectFacebook(id) {
    
    this.facebookSelectedName = id;
  }

  saveFacebookAccount() {
    if(!this.isEditMode){
    let data = {
      id: "00000000-0000-0000-0000-000000000000",
      urlOrName: this.facebookSelectedName,
      isActive: true,
      CampaignID: this.masterCampaignId,
      accessToken: this.facebookAccessToken,
      refreshToken: '1111'
    }
    this.campaignService.createFacebook(data).subscribe(
      res => {
        
        this.successAlert()
      });
    }
    if(this.isEditMode){
      if(this.facebookid == null || this.facebookid ==undefined ||this.facebookid =='null' ||this.facebookid ==''){
        let data = {
          id: "00000000-0000-0000-0000-000000000000",
          urlOrName: this.facebookSelectedName,
          isActive: true,
          CampaignID: this.masterCampaignId,
          accessToken: this.facebookAccessToken,
          refreshToken: '1111'
        }
        this.campaignService.createFacebook(data).subscribe(
          res => {
            
            this.successAlert()
          });
      }else{
      let data = {
        id: this.facebookid,
        urlOrName: this.facebookSelectedName,
        isActive: true,
        CampaignID: this.masterCampaignId,
        accessToken: this.facebookAccessToken,
        refreshToken:  '1111'
      }
      this.campaignService.updateFacebook(this.facebookid, data).subscribe(response => {
        debugger
        this.successAlert();
      });
    }
  }
  }
  getGSCSiteList() {
    
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gscAccessToken,
      })
    };
    const url = "https://searchconsole.googleapis.com/webmasters/v3/sites?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    let data = {};
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        
        let rows = res['siteEntry'];
        //let accountSummaryIds=[];
        for (let i = 0; i < rows.length; i++) {
          let p = rows[i]
          let q = p.siteUrl.toString();
          this.gscAccounts.push(q);
        }
        this.gaSelectForm.controls['gscSelect'].setValue(this.gscurl, {onlySelf: true});
      }
    }, error => {
      //alert('Data fetch failed for current year for URL : ' + this.selectedCampIdWebUrl + " --Error : - " + JSON.stringify(error.error));
    });
  }
  signOut() {
    this.authService.signOut();
  }
  refreshUserToken() {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      this.getAnalyticsProfileIds2();
    });
  }
  loginWithOptions() {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      // scope: 'public_profile,user_friends,email,pages_show_list'
      //scope: 'pages_show_list'
      scope: 'pages_show_list,read_insights,pages_read_engagement'
    };

    this.facebook.login(loginOptions)
      .then((res: LoginResponse) => {
        
        this.hasFacebookSetup = true;
        this.facebookAccessToken = res['authResponse'].accessToken;
        localStorage.setItem('FacebookAccessToken', this.accessToken);
        this.facebookAccounts = [];
        this.getFacebookPagesList();
      })
      .catch();
  }
  getFacebookPagesList() {
    
    const url = "https://graph.facebook.com/me/accounts?&access_token=" + this.facebookAccessToken;
    this.http.get(url).subscribe(res => {
      if (res) {
        
        let rows = res['data'];
        for (let i = 0; i < rows.length; i++) {
          let p = rows[i]
          let q = p.name.toString();
          this.facebookAccounts.push(q);
        }
        this.gaSelectForm.controls['facebookSelect'].setValue(this.facebookpagename, {onlySelf: true});
      }
    }, error => {
      this.snackbarService.show('Fetch New Likes Count Failed : ' + JSON.stringify(error.error));
    });
  }


}
