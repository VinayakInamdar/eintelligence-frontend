import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Campaign } from '../../campaign/campaign.model';
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { LocalDataSource } from 'ng2-smart-table';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from '../../overview/overview.service';
import { CampaignService } from '../../campaign/campaign.service';
import { IntegrationsService } from '../../integrations/integrations.service';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
const success = require('sweetalert');
@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {

  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  campaignName: String;
  selectedCampId: string;
  gaAccounts: any;
  hasGaSetup: boolean;
  valForm: FormGroup;
  campaignModel: Campaign;
  showSpinnerBaseChart: boolean = true;
  googleAnalyticsAccountSetupList: GoogleAnalyticsAccountSetups[];
  activeAccount: any;
  hasActiveAccount: boolean = false;
  authorizeGaAccounts: any;
  hasAuthorize: boolean;
  reportsData: any;
  selectedCampaignName: string;
  bsValue = new Date();
  date = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split("T")[0];
  audiencesubmenu: boolean;
  behaviorsubmenu: boolean;
  conversionsubmenu: boolean = false;
  ;
  endDate = new Date().toISOString().split("T")[0];;
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
  settingActive: number = 0;
  settings = {
    actions: { add: false, edit: false, delete: false },
    attr: {
      class: 'table'
    },
    columns: {
      name: {
        title: '',
        filter: false,
      },
      sessions: {
        title: 'Session',
        valuePrepareFunction: (sessions) => {
          return this.convertToNumberInTwoDecimal(sessions, undefined)
        },
        filter: false
      },
      percentNewSessions: {
        title: '% Session',
        valuePrepareFunction: (percentNewSessions) => {

          return this.convertToNumberInTwoDecimal(percentNewSessions, '%')
        },
        filter: false
      },
      users: {
        title: 'Users',
        valuePrepareFunction: (users) => {

          return this.convertToNumberInTwoDecimal(users, undefined)
        },
        filter: false
      },
      bounceRate: {
        title: 'Bounce Rate',
        valuePrepareFunction: (bounceRate) => {

          return this.convertToNumberInTwoDecimal(bounceRate, undefined)
        },
        filter: false
      },
      pageviews: {
        title: 'Goal Value',
        valuePrepareFunction: (pageviews) => {

          return this.convertToNumberInTwoDecimal(pageviews, undefined)
        },
        filter: false
      },
      pageviewsPerSession: {
        title: 'Page vew per Session',
        valuePrepareFunction: (pageviewsPerSession) => {

          return this.convertToNumberInTwoDecimal(pageviewsPerSession, undefined)
        },
        filter: false
      },
      avgSessionDuration: {
        title: 'Avg. Session Duration',
        valuePrepareFunction: (avgSessionDuration) => {

          return this.convertTohhmmss(avgSessionDuration)
        },
        filter: false
      },
      goalConversionRateAll: {
        title: 'Goal Conversation Rate',
        valuePrepareFunction: (goalConversionRateAll) => {

          return this.convertToNumberInTwoDecimal(goalConversionRateAll, '%')
        },
        filter: false
      },
      goalCompletionsAll: {
        title: 'Goal Completions',
        valuePrepareFunction: (goalCompletionsAll) => {

          return this.convertToNumberInTwoDecimal(goalCompletionsAll, undefined)
        },
        filter: false
      },

    }
  };
  source: LocalDataSource;
  dropdownlabels: any = [
    { id: 0, label: 'Sessions', value: 'sessions' },
    { id: 1, label: 'Users', value: 'users' },
    { id: 2, label: 'New Sessions', value: 'percentNewSessions' },
    { id: 3, label: 'Bouncerate', value: 'bounceRate' },
    { id: 4, label: 'Pageviews', value: 'pageviews' },
    { id: 5, label: 'Pages/Sessions', value: 'pageviewsPerSession' },
    { id: 6, label: 'Avg Sess. Duration', value: 'avgSessionDuration' },
    { id: 7, label: 'Goal Completio', value: 'goalCompletionsAll' },
    { id: 8, label: 'Conversation Rate', value: 'goalConversionRateAll' }
  ]
  dropdownlabels1: any = [
    { id: 0, label: 'Sessions', value: 'sessions' },
    { id: 1, label: 'Users', value: 'users' },
    { id: 2, label: 'New Sessions', value: 'percentNewSessions' },
    { id: 3, label: 'Bouncerate', value: 'bounceRate' },
    { id: 4, label: 'Pageviews', value: 'pageviews' },
    { id: 5, label: 'Pages/Sessions', value: 'pageviewsPerSession' },
    { id: 6, label: 'Avg Sess. Duration', value: 'avgSessionDuration' },
    { id: 7, label: 'Goal Completio', value: 'goalCompletionsAll' },
    { id: 8, label: 'Conversation Rate', value: 'goalConversionRateAll' }
  ]
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Sessions', borderCapStyle: 'square', fill: false },
  ];

  lineChartLabels: Label[] = [];


  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 15
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    }

  };

  lineChartColors: Color[] = [
    {
      borderColor: '#2D9EE2',
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      pointBorderColor: '#2D9EE2',
      pointBackgroundColor: 'white'
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  campaignList: Campaign[];
  showdiv: boolean = false;
  show: string = 'undefine';
  url: string;
  bsInlineRangeValue: Date[];
  acqusitionsubmenu: boolean = false;
  public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';



  constructor(private translate: TranslateService, private route: ActivatedRoute, fb: FormBuilder, private router: Router, private integrationsService: IntegrationsService,
    private overvieswService: OverviewService, private openIdConnectService: OpenIdConnectService, public campaignService: CampaignService) {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    this.url = this.router.url
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    this.getGaSetupByCampaignId();
    this.getCampaignList();

    this.valForm = fb.group({
      'name': [undefined, Validators.required],
      'webUrl': [undefined, [Validators.required, Validators.pattern(this.myreg)]],
      'moreTraffic': [undefined, Validators.required],
      'sales': [undefined, Validators.required],
      'leadGeneration': [undefined, Validators.required],
    })

  }
  ngAfterViewChecked(): void {
    // this.rFactor()
  }

  ngOnInit(): void {

    let name = this.route.snapshot.paramMap.get('name');
    this.campaignName = ` ${name}`;

    this.getAnalyticsData();
    this.conversionsubmenu = true;
    this.showDiv(event, 'true', 'analytics', 'conversionsubmenu')
    // setTimeout(() => {
    //   this.rFactor()
    // }, 1000);

  }
  // using to check Integration Status of selected campaign Id
  goToOverview(): void {
    // let id = this.route.snapshot.paramMap.get('id');
    // this.selectedCampId = `${id}`;

    this.router.navigate(['/integrations', this.selectedCampId]);
  }

  //using to view keyword list and also add new keyword
  goToKeywords(): void {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`,])
  }

  public goToAddKeywords(): void {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`], {
      queryParams: {
        view: 'addKeyword'
      },
    })
  }
  // using to get analytics data of selected campaign Id
  getAnalyticsData(): void {

    this.campaignService.getGaAnalyticsReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
      res => {
        this.campaignService.GetGaConversionsAnalyticsReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
          behaviorres => {
            this.reportsData = res;
            this.source = new LocalDataSource(behaviorres['conversaions']);
            this.convertToLineChartsLabels(this.reportsData.gaPreparedDataDto.date)
            this.convertToLineChartsData(this.reportsData.gaPreparedDataDto.sessions)
            this.showSpinnerBaseChart = false;
          })


      }
    );


  }

  //using to show charts data according to selected value in both dropdown
  convertToLineChartsData(sessions: any) {
    if (this.lineChartData.length > 1) {

      this.lineChartData[0].data = this.reportsData.gaPreparedDataDto[this.selectedLabelValue]
      this.lineChartData[1].data = this.reportsData.gaPreparedDataDto[this.selectedLabelValue1]

    }
    else {
      this.lineChartData[0].data = this.reportsData.gaPreparedDataDto[this.selectedLabelValue]
    }
  }

  // using to convert res date in valid chart's date format
  convertToLineChartsLabels(reportDates) {
    var LineChartsdate = []
    reportDates.map((s, i) => {
      var one = s.substring(0, s.length - 4);
      var two = s.substring(s.length - 4, s.length - 2);
      var three = s.substring(s.length - 2);
      var finalstring = one + '/' + two + '/' + three
      var date = new Date(finalstring)
      var date2 = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
      var arraydate = date2.split(' ')
      var odate = arraydate[1];
      var omon = arraydate[0];
      var finaldate = odate + " " + omon
      LineChartsdate.push(finaldate)
    })
    this.lineChartLabels = LineChartsdate

  }

  // using to get google analytics setup of selected campaign Id
  public getGaSetupByCampaignId(): void {


    this.integrationsService.getGaSetupByCampaignId(this.selectedCampId).subscribe(


      res => {
        this.googleAnalyticsAccountSetupList = res;
        if (this.googleAnalyticsAccountSetupList && this.googleAnalyticsAccountSetupList.length > 0) {


          this.gaAccounts = this.googleAnalyticsAccountSetupList.map(function (item) { return item.googleAccountSetups; });

          this.authorizeGaAccounts = this.gaAccounts.filter(function (item) { return item.isAuthorize == true });

          this.activeAccount = this.googleAnalyticsAccountSetupList.map(function (item) {
            if (item.active == true) {
              return item.googleAccountSetups;
            }
          })[0];

          if (this.activeAccount) {
            this.hasActiveAccount = true;
          }

          if (this.authorizeGaAccounts.length > 0) {
            this.hasAuthorize = true
          }

        }
        else {
          this.hasActiveAccount = false;
          this.hasAuthorize = false;
          this.reportsData = undefined
        }

        //distinct google account


      });
  };

  //to get campaignList to select campaign name
  public getCampaignList(): void {
    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      var name = "";
      this.campaignList.map((s, i) => {
        if (s.id == this.selectedCampId) {
          name = s.name
        }
      })
      this.selectedCampaignName = name;
      // var data = [{
      //   defaultValue: '(not set)',
      // },{
      //   defaultValue: 'Alternative to Zendesk',
      // },
      // ]

    });
  }


  // using to navigate to overview page to view anlytics of selected campaign
  public onCampaignSelect(event, selectedCampaign) {
    this.selectedCampaignName = selectedCampaign.name
    this.selectedCampId = selectedCampaign.id
    this.router.navigate(['/campaign', { id: selectedCampaign.id }], {
      queryParams: {
        view: 'showReport'
      },
    });

    this.getGaSetupByCampaignId();
    this.getAnalyticsData();
  }

  // using to  create new campaign in db
  submitForm(value: any) {

    var result: Campaign = Object.assign({}, value);
    result.userId = this.openIdConnectService.user.profile.sub;
    //  result.profilePicture = this.fileToUpload.name

    this.campaignService.createCampaign(result).subscribe((res: Campaign) => {
      this.campaignModel = res;
      //validation
      event.preventDefault();
      for (let c in this.valForm.controls) {
        this.valForm.controls[c].markAsTouched();
      }
      if (!this.valForm.valid) {
        return;
      }

    });
  }

  // using to select nect tab
  goToNextTab(event, inputvalue, fieldName, tabid) {
    event.preventDefault()
    var value = this.validateForm(fieldName)

    if (value == 'VALID') {
      this.staticTabs.tabs[tabid].disabled = false;
      this.staticTabs.tabs[tabid].active = true;
    }
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
          className: "bg-danger",
          closeModal: true,
        }
      }
    }).then((isConfirm: any) => {
      if (isConfirm) {
        this.router.navigate(['/home']);
      }
    });
  }

  // using to change properties with changing 1st dropdown value
  public onLabelSelect(event, selectedLabel) {
    this.selectedLabel = selectedLabel.id
    this.selctedLabelName = selectedLabel.label
    this.selectedLabelValue = selectedLabel.value
    this.lineChartData[0].label = selectedLabel.label
    this.updateChart(selectedLabel)
  }

  // using to change properties with changing select matrix dropdown value
  public onLabelSelect1(event, selectedLabel) {
    this.selectedLabel1 = selectedLabel.id
    this.selctedLabelName1 = selectedLabel.label
    this.selectedLabelValue1 = selectedLabel.value
    this.updateChart1(selectedLabel)
  }

  //using to update chart with changing 1st dropdown value
  updateChart(selectedLabel) {
    var dataforselectedLabel = []
    dataforselectedLabel = this.reportsData.gaPreparedDataDto[selectedLabel.value]
    this.lineChartData[0].data = dataforselectedLabel
    this.chart.chart.update();
  }

  // using to update chart with changing select matrix dropdown value
  updateChart1(selectedLabel) {
    var dataforselectedLabel = []
    dataforselectedLabel = this.reportsData.gaPreparedDataDto[selectedLabel.value]
    if (this.lineChartData.length > 1) {
      this.lineChartData.splice(1, 1, { backgroundColor: "rgba(255,255,0,0.3)", borderColor: "#f5994e", data: dataforselectedLabel, label: selectedLabel.label, borderCapStyle: 'square', pointBackgroundColor: "white", pointBorderColor: "#2D9EE2", fill: false })
    }
    else {
      this.lineChartData.splice(1, 0, { backgroundColor: "rgba(255,255,0,0.3)", borderColor: "#f5994e", data: dataforselectedLabel, label: selectedLabel.label, borderCapStyle: 'square', pointBackgroundColor: "white", pointBorderColor: "#2D9EE2", fill: false })
    }
    this.chart.chart.update();
  }

  // using to catch event to change report accroding to selected date range
  public onDateRangeSelect(event) {
    var StartDate = event[0].toISOString().split("T")[0];
    var endDate = event[1].toISOString().split("T")[0];
    this.startDate = StartDate;
    this.endDate = endDate
    this.getAnalyticsData();
  }

  // using to open create campaign view to add new campaign in db
  public onClick(event): any {
    this.router.navigate(['/home/campaign']);
  }

  //using to open div on mouseover event
  public showDiv(event, value, show, submenu) {
    this.showdiv = value == 'true' ? true : false;
    this.show = show;
    this.conversionsubmenu = submenu == 'conversionsubmenu' ? true : false;
    this.acqusitionsubmenu = false;
    this.audiencesubmenu = false;
    this.behaviorsubmenu = false;

  }
  // random values for demo
  rFactor() {
    var index = 0;
    var ci = this.chart.datasets;

    ci.forEach(function (e, i) {


      if (i !== index) {
        e.hidden = true;
      }
      else if (i === index) {
        e.hidden = null;
      }
    });

    this.chart.update();
  };

  // using to navigate to analytics overview page
  public goToAnalyticsOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics`])
  }

  // using to navigate to analytics acquision page
  public goToAcquisiton(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition`])
  }

  //using to navigate to analytics acqusition traffic sources page
  public goToAcquisitonTrafficSources(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition/traffic-sources`])
  }

  // using to navigate to analytics acquisition sources mediums page
  public goToAcquisitonSourcesMediums(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition/sources-mediums`])
  }

  // using to navigate to analytics acqusition campaigns page
  public goToAcquisitonCampaigns(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition/campaigns`])
  }

  // using to navigate to analytics audience page
  public goToAudience(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience`])
  }

  // using to navigate to analytics audience device-category page
  public goToAudienceDeviceCategory(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience/device-category`])
  }

  // using to navigate to analytics audience geo-locations page
  public goToAudienceGeoLocations(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience/geolocation`])
  }

  // using to navigate to analytics audience languages page
  public goToAudienceLanguages(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience/languages`])
  }

  // using to navigate to analytics behavior page
  public goToBehavior(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior`])
  }

  // using to navigate to analytics behavior landing-pages page
  public goToBehaviorLandingPages(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior/landing-pages`])
  }

  // using to navigate to analytics behavior event page
  public goToBehaviorEvent(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior/events`])
  }

  // using to navigate to analytics behavior site speed page
  public goToBehaviorSiteSpeed(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior/site-speed`])
  }

  // using to navigate to analytics conversions page
  public goToConversions(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/conversions`])
  }

  // using to navigate to analytics conversion eCommerce page
  public goToConversionseCommerce(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/conversions/ecommerce`])
  }

  // using to navigate to analytics conversaion goals page
  public goToConversionsGoals(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/conversions/goals`])
  }

  // using to navigate to seo overview page
  public goToSeoOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo`])
  }
  public convertToNumberInTwoDecimal(value, type) {
    var number = Number(value)
    return type == '%' ? number.toFixed(2) + '%' : number.toFixed(2);
  }

  public convertTohhmmss(avgSessionDuration: any) {
    var dateObj = new Date(avgSessionDuration * 60 * 1000);
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();
    var seconds = dateObj.getSeconds();

    var timeString = hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
    return timeString;
  }

}
