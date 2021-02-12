import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Campaign } from '../../campaign/campaign.model';
import { Subscription } from 'rxjs';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { LocalDataSource } from 'ng2-smart-table';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { CampaignService } from '../../campaign/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from '../../overview/overview.service';
import { AuditsService } from '../../audits/audits.service';
import { DatePipe, PlatformLocation } from '@angular/common';
import { IntegrationsService } from '../../integrations/integrations.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import * as Chart from 'chart.js';
import { SerpDto } from '../serp.model';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { parseDate } from 'ngx-bootstrap/chronos';


const success = require('sweetalert');
@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss']
})
export class SeoComponent implements OnInit {

  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild(BaseChartDirective)
  period="28Days";
  //Ranking graph rubina
  rankingGraphData;
  tempRankingGraphData = [];
  averageRanking;
  serpList;
  barDataArray: any[] = [];
  //-------------
  //-------------GSC data variable start-------------------
  gscUrl;
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

  startDategsc;
  endDategsc;
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
  selectedCampId: string;
  selectedCampaignName: string;
  barDataClicks = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'This Year', legend: false, fill: false
      }, {
        data: [], label: 'Previous Year', legend: false, fill: false,
      }]
  };
  barDataImpressions = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'This Year', legend: false, fill: false
      }, {
        data: [], label: 'Previous Year', legend: false, fill: false,
      }]
  };
  barDataCTR = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'This Year', legend: false, fill: false
      }, {
        data: [], label: 'Previous Year', legend: false, fill: false,
      }]
  };
  barDataPositions = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'This Year', legend: false, fill: false
      }, {
        data: [], label: 'Previous Year', legend: false, fill: false,
      }]
    // datasets: [
    //   {
    //     data: [], label: 'Clicks', legend: false, fill: false
    //   }, {
    //     data: [], label: 'Impressions', legend: false, fill: false,
    //   }, {
    //     data: [], label: 'Position', legend: false, fill: false,
    //   }]
  };
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  // };
  barDataImpressionsDevice = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'Impressions', legend: false, fill: false
      }]
  };
  barDataClicksDevice = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'Clicks', legend: false, fill: false
      }]
  };
  barDataPositionDevice = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'Position', legend: false, fill: false
      }]
  };
  barChartLabels: Label[] = [];
  barChartLabelsDevice: Label[] = [];
  barColors = [
    {
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      borderColor: '#2D9EE2',
      pointHoverBackgroundColor: '#2D9EE2',
      pointHoverBorderColor: 'white'
    },
    {
      backgroundColor: 'rgba(12, 162, 111, 0.2)',
      borderColor: '#2DEEE2',
      pointHoverBackgroundColor: '#2DEEE2',
      pointHoverBorderColor: 'white'
    }];
  accessToken = '';
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  //-------------GSC data variable end -------------------
  public chart: BaseChartDirective;
  @ViewChild('dougnutChart')
  public dougnutchart: BaseChartDirective;
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
    lineWidth: 5,
    lineCap: 'circle'
  };
  doughnutData = {
    labels: [
      'Direct',
      'Organic Search',
      'Referral',
      'Social',
      'Display',
    ],
    datasets: [{
      data: [130, 65, 40, 15, 25]
    },]
  };

  doughnutColors = [{
    borderColor: 'white',
    backgroundColor: [
      "#0000D6",
      "#36A1F7",
      "#8CC8FA",
      "#E2F1FD",
      "#FF723D",
    ],
  }];

  doughnutOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        document.getElementById("canvas").style.cursor = 'pointer';
      },
    },
  };
  doughnutData1 = {
    labels: [
      'Desktop',
      'Mobile',
      'Tablet',
    ],
    datasets: [{
      data: [130, 65, 40]
    },]
  };

  doughnutColors1 = [{
    borderColor: 'white',
    backgroundColor: [
      "#0000D6",
      "#36A1F7",
      "#8CC8FA",
    ],
  }];

  doughnutOptions1 = {
    responsive: true,
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        document.getElementById("canvas").style.cursor = 'pointer';
      },
    },
  };
  sub: Subscription;
  id: number;
  public demo1TabIndex = 0;
  public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  url: string;
  gaAccounts: any;
  hasGaSetup: boolean;
  showSpinnerBaseChart: boolean = true;
  showSpinnerSiteAnalysisContent: boolean = true;
  googleAnalyticsAccountSetupList: GoogleAnalyticsAccountSetups[];
  activeAccount: any;
  hasActiveAccount: boolean = false;
  authorizeGaAccounts: any;
  hasAuthorize: boolean;
  reportsData: any;
  settings = {
    actions: { add: false, edit: false, delete: false },
    columns: {
      keywords: {
        title: 'KEYWORD PHRASE',
        filter: false
      },
      tags: {
        title: 'TAGS',
        filter: false
      },
      position: {
        title: 'POSITION',
        filter: false
      },
      searches: {
        title: 'SEARCHES',
        valuePrepareFunction: (searches) => {

          return this.convertToShortNumber(searches)
        },
        filter: false
      },
      location: {
        title: 'LOCATIONS',
        filter: false
      }
    }
  };
  source: LocalDataSource;
  bsValue = new Date();
  date = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split("T")[0]; queryParams: any;
  setCurrentSettingActive: number;
  selectedCampaignTaskId: string;
  securitySection: { ssl: any; sslcertificate: any; have_sitemap: any; have_robots: any; };
  chart1: Chart;
  showDefault: string;
  trafficsourcesSessionsData: any[];
  trafficsourcedate: { display: any[]; medium: any[]; referral: any[]; social: any[]; source: any[]; };
  array1: any[];
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
    { data: [], label: 'Total Monthly Traffic', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
  ];

  lineChartLabels: Label[] = [];

  //lineChartLabels: Label[] = this.dateLabels;

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        document.getElementById("canvas").style.cursor = 'pointer';
      },
      onClick: function (e, legendItem) {
        var index = legendItem.datasetIndex;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

        ci.data.datasets.forEach(function (e, i) {
          var meta = ci.getDatasetMeta(i);

          if (i === index) {
            if (alreadyHidden) {
              meta.hidden = meta.hidden === null ? !meta.hidden : null;
            }
            else {
              meta.hidden = true;
            }

          }
        });

        ci.update();
      },
    },
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
      backgroundColor: '#2D9CDB',
      pointBorderColor: '#2D9EE2',
      pointBackgroundColor: 'white'
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  lineChartData1: ChartDataSets[] = [
    { data: [], label: 'Direct', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Organic', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Referral', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Paid', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Others', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
  ];

  lineChartLabels1: Label[] = [];

  //lineChartLabels: Label[] = this.dateLabels;

  lineChartOptions1: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        document.getElementById("canvas").style.cursor = 'pointer';
      },
      onClick: function (e, legendItem) {
        var index = legendItem.datasetIndex;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

        ci.data.datasets.forEach(function (e, i) {
          var meta = ci.getDatasetMeta(i);

          if (i === index) {
            if (alreadyHidden) {
              meta.hidden = meta.hidden === null ? !meta.hidden : null;
            }
            else {
              meta.hidden = true;
            }

          }
        });

        ci.update();
      },
    },
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

  lineChartColors1: Color[] = [
    {
      borderColor: '#2D9EE2',
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      pointBorderColor: '#2D9EE2',
      pointBackgroundColor: 'white'
    },
  ];
  lineChartLegend1 = true;
  lineChartPlugins1 = [];
  lineChartType1 = 'line';
  lineChartData2: ChartDataSets[] = [
    { data: [], label: 'Desktop', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Mobile', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Tablet', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
  ];

  lineChartLabels2: Label[] = [];

  //lineChartLabels: Label[] = this.dateLabels;

  lineChartOptions2: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        document.getElementById("canvas").style.cursor = 'pointer';
      },
      onClick: function (e, legendItem) {
        var index = legendItem.datasetIndex;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

        ci.data.datasets.forEach(function (e, i) {
          var meta = ci.getDatasetMeta(i);

          if (i === index) {
            if (alreadyHidden) {
              meta.hidden = meta.hidden === null ? !meta.hidden : null;
            }
            else {
              meta.hidden = true;
            }

          }
        });

        ci.update();
      },
    },
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

  lineChartColors2: Color[] = [
    {
      borderColor: '#2D9EE2',
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      pointBorderColor: '#2D9EE2',
      pointBackgroundColor: 'white'
    },
  ];
  lineChartLegend2 = true;
  lineChartPlugins2 = [];
  lineChartType2 = 'line';
  barData = {

    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: 'Ranking',
      }]
  };
  barChartLabels1: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

  barColors1 = [
    {
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      borderColor: '#2D9EE2',
      pointHoverBackgroundColor: '#2D9EE2',
      pointHoverBorderColor: 'white'
    },];

  barOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        document.getElementById("canvas").style.cursor = 'pointer';
      },
      onClick: function (e, legendItem) {
        var index = legendItem.datasetIndex;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

        ci.data.datasets.forEach(function (e, i) {
          var meta = ci.getDatasetMeta(i);

          if (i === index) {
            if (alreadyHidden) {
              meta.hidden = meta.hidden === null ? !meta.hidden : null;
            }
            else {
              meta.hidden = true;
            }

          }
        });

        ci.update();
      },
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        barPercentage: 0.4,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 15,
          callback: function (value) {
            if (value.length > 9) {
              return value.substr(0, 4) + '...'; //truncate
            } else {
              return value
            }

          },
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    tooltips: {
      enabled: true,
      mode: 'label',
      callbacks: {
        title: function (tooltipItems, data) {
          var idx = tooltipItems[0].index;
          return data.labels[idx]; //do something with title
        },
        label: function (tooltipItems, data) {
          //var idx = tooltipItems.index;
          //return data.labels[idx] + ' €';
          return tooltipItems.yLabel + '  Keywords'
        }
      }
    },
  };
  barData1 = {
    labels: ['#1', 'Top 10', 'Moved Up', 'Moved Down', 'New (Entered 100)'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], legend: false
      }, {
        data: [], legend: false
      }, {
        data: [], legend: false
      }, {
        data: [], legend: false
      },
      {
        data: [], legend: false
      },]
  };

  barColors2 = [
    {
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      borderColor: '#2D9EE2',
      pointHoverBackgroundColor: '#2D9EE2',
      pointHoverBorderColor: 'white'
    },];

  barOptions1 = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 15,
          callback: function (value) {
            if (value.length > 9) {
              return value.substr(0, 4) + '...'; //truncate
            } else {
              return value
            }

          },
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    tooltips: {
      enabled: true,
      mode: 'label',
      callbacks: {
        title: function (tooltipItems, data) {
          var idx = tooltipItems[0].index;
          return data.labels[idx]; //do something with title
        },
        label: function (tooltipItems, data) {
          //var idx = tooltipItems.index;
          //return data.labels[idx] + ' €';
          return 'Keywords : ' + tooltipItems.yLabel;
        }
      }
    },
  };


  showdiv: boolean = false;
  show: string = 'undefine';
  bsInlineRangeValue: Date[];
  acqusitionsubmenu: boolean = false;
  audiencesubmenu: boolean = false;
  behaviorsubmenu: boolean = false;
  conversionsubmenu: boolean = false;
  settingActive: number = 3;
  isShowLoginButton = false;

  constructor(private translate: TranslateService, fb: FormBuilder,
    private campaignService: CampaignService,private openIdConnectService: OpenIdConnectService, 
    public route: ActivatedRoute, public router: Router, private integrationsService: IntegrationsService
    , private overvieswService: OverviewService, location: PlatformLocation,
    public auditsService: AuditsService, private http: HttpClient, public datepipe: DatePipe, private authService: SocialAuthService) {

    this.campaignModel = new Campaign();
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    // this.getGaSetupByCampaignId();
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    this.getDateSettings() ;
    this.getGaSetupByCampaignId();
    this.getAnalyticsData();
    this.getCampaignList();
    this.getSerpList();
    this.getRankingGraphData();
    this.showdiv = true;
    this.show = 'seo';
    this.showDefault = 'seo';
    this.showDiv(event, this.showdiv, this.show)
    location.onPopState(() => {


    });
   

    this.valForm = fb.group({
      'name': [this.campaignModel.name, Validators.required],
      'webUrl': [this.campaignModel.webUrl, [Validators.required, Validators.pattern(this.myreg)]],
      'moreTraffic': [this.campaignModel.moreTraffic, Validators.required],
      'sales': [this.campaignModel.sales, Validators.required],
      'leadGeneration': [this.campaignModel.leadGeneration, Validators.required],
    })
  }

  checkqueryparams() {
    var params = { ...this.route.snapshot.queryParams };
    this.queryParams = params.view
    delete params.view;
    this.router.navigate([], { queryParams: params });
    this.settingActive = 3;
    this.getGaSetupByCampaignId();
    this.getAnalyticsData();
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
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
 
  }

  // using to check Integration Status of selected campaign Id
  goToOverview(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    this.router.navigate(['/integrations', this.selectedCampId]);
  }

  // using to get analytics data of selected campaign Id
  getAnalyticsData(): void {

    this.campaignService.getGaAnalyticsReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
      res => {
        this.campaignService.GetTrafficSourcesReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
          trafficsourcers => {
            var array = [trafficsourcers['display'], trafficsourcers['medium'], trafficsourcers['referral'],
            trafficsourcers['social'], trafficsourcers['source']]
            this.convertToLineChartsLabels(array)

          })

        this.reportsData = res;
        this.dateLabels = this.reportsData.gaPreparedDataDto.date;

        // this.convertToLineChartsLabels(this.reportsData.gaPreparedDataDto.date)
        // this.convertToLineChartsData(this.reportsData.gaPreparedDataDto.sessions)

        // this.showSpinnerBaseChart = false;
      }
    );


  }

  //using to show charts data according to selected value in both dropdown
  convertToLineChartsData(sessions: any) {
    if (this.lineChartData.length > 1) {
      this.lineChartData[0].data = this.reportsData.gaPreparedDataDto[this.selectedLabelValue]
      this.lineChartData[1].data = this.reportsData.gaPreparedDataDto['percentNewSessions']
      this.lineChartData[2].data = this.reportsData.gaPreparedDataDto['bounceRate']
      this.lineChartData[3].data = this.reportsData.gaPreparedDataDto['bounceRate']
      this.lineChartData[4].data = this.reportsData.gaPreparedDataDto['pageviews']

    }
    else {
      this.lineChartData[0].data = this.reportsData.gaPreparedDataDto[this.selectedLabelValue]
      var values = ['sessions', 'percentNewSessions', 'bounceRate', 'bounceRate', 'pageviews']
      for (var i = 0; i < 5; i++) {
        this.lineChartData1[i].data = this.reportsData.gaPreparedDataDto[values[i]]
      }
    }
  }

  // using to convert res date in valid chart's date format
  convertToLineChartsLabels(reportDates) {
    var LineChartsdate = []
    var array1 = []
    var array2 = []
    var array3 = []
    var array4 = []
    var array5 = []
    this.trafficsourcedate = { display: [], medium: [], referral: [], social: [], source: [] }

    if (reportDates.length == 1 && reportDates[0]['date']) {
      reportDates[0]['date'].map((s, i) => {
        var date = this.changeDatesFormat(s, i)
        array1.push({ date: date, sessions: reportDates[0]['sessions'][i] })
      }, this.trafficsourcedate.display = array1)
    }

    if (reportDates.length == 2 && reportDates[1]['date']) {
      reportDates[1]['date'].map((s, i) => {
        var date = this.changeDatesFormat(s, i)
        array2.push({ date: date, sessions: reportDates[1]['sessions'][i] })
      }, this.trafficsourcedate.medium = array2)
    }

    if (reportDates.length == 3 && reportDates[2]['date']) {
      reportDates[2]['date'].map((s, i) => {
        var date = this.changeDatesFormat(s, i)
        array3.push({ date: date, sessions: reportDates[2]['sessions'][i] })
      }, this.trafficsourcedate.referral = array3)
    }

    if (reportDates.length == 4 && reportDates[3]['date']) {
      reportDates[3]['date'].map((s, i) => {
        var date = this.changeDatesFormat(s, i)
        array4.push({ date: date, sessions: reportDates[3]['sessions'][i] })
      }, this.trafficsourcedate.social = array4)
    }

    if (reportDates.length == 5 && reportDates[4]['date']) {
      reportDates[4]['date'].map((s, i) => {
        var date = this.changeDatesFormat(s, i)
        array5.push({ date: date, sessions: reportDates[4]['sessions'][i] })
      }, this.trafficsourcedate.source = array5)
    }








    var from = new Date(this.startDate);
    var to = new Date(this.endDate);
    var dates = []
    // loop for every day
    for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
      var date2 = day.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
      var arraydate = date2.split(' ')
      var odate = arraydate[1];
      var omon = arraydate[0];
      var finaldate = odate + " " + omon
      // your day is here
      dates.push(finaldate)

    }
    LineChartsdate = dates;
    console.log(dates)

    var finalData1 = dates.map(s => {
      var f = this.trafficsourcedate.display.find(x => x.date == s)
      return f ? parseInt(f.sessions) : 0;
    })
    var finalData2 = dates.map(s => {
      var f = this.trafficsourcedate.medium.find(x => x.date == s)
      return f ? parseInt(f.sessions) : 0;
    })
    var finalData3 = dates.map(s => {
      var f = this.trafficsourcedate.referral.find(x => x.date == s)
      return f ? parseInt(f.sessions) : 0;
    })

    var finalData4 = dates.map(s => {
      var f = this.trafficsourcedate.social.find(x => x.date == s)
      return f ? parseInt(f.sessions) : 0;
    })
    var finalData5 = dates.map(s => {
      var f = this.trafficsourcedate.source.find(x => x.date == s)
      return f ? parseInt(f.sessions) : 0;
    })
    console.log(finalData1, finalData2, finalData3, finalData4, finalData5)
    this.lineChartData1[0].data = finalData5
    this.lineChartData1[1].data = finalData2
    this.lineChartData[0].data = finalData2
    this.lineChartData1[2].data = finalData3
    this.lineChartData1[3].data = finalData4
    this.lineChartData1[4].data = finalData1
    this.lineChartLabels = LineChartsdate
    this.lineChartLabels1 = LineChartsdate
    this.showSpinnerBaseChart = false;

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

  // using to get list of campaigns
  public getCampaignList(): void {
    debugger
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
      this.getSelectedCampaignWebsiteAuditReportData()
      this.accessToken =  localStorage.getItem('googleGscAccessToken');
      if(this.accessToken != null && this.accessToken != undefined && this.accessToken!= ''){
        debugger
      this.getData();
      }else{
        this.isShowLoginButton =true;
      }
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
  // using to get list of keyword list
 

  // using to navigate to overview page to view anlytics of selected campaign
  public onCampaignSelect(event, selectedCampaign) {
    this.selectedCampaignName = selectedCampaign.name
    this.selectedCampId = selectedCampaign.id
    this.router.navigate(['/campaign', { id: this.selectedCampId }]);
    this.settingActive = 3
    this.selectedCampIdWebUrl = selectedCampaign.webUrl
    this.getSelectedCampaignWebsiteAuditReportData()
    this.getGaSetupByCampaignId();
    this.getAnalyticsData();
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

  // using to  create new campaign in db
  submitForm(value: any) {

    var result: Campaign = Object.assign({}, value);
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
    this.router.navigate(['/campaign', { id: campaign.data.id }]);
    this.settingActive = 3
    this.selectedCampIdWebUrl = campaign.data.webUrl
    this.getSelectedCampaignWebsiteAuditReportData()
    this.getGaSetupByCampaignId();
    this.getAnalyticsData();

  }
  onSelect(period1) {
    debugger
    this.period = period1;
    let currDate = new Date();
    if(period1 == "28Days" ){
      debugger

      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
      currDate = new Date();
      this.previousEndDate =  this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    }
    if(period1 == "week" ){
      debugger

      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 7), 'yyyy-MM-dd');
      currDate = new Date();
      this.previousEndDate =  this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 7), 'yyyy-MM-dd');
    }
    if(period1 == "day" ){
      debugger

      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 1), 'yyyy-MM-dd');
      currDate = new Date();
      this.previousEndDate =  this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 1), 'yyyy-MM-dd');
    }
    this.getData();
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
      this.lineChartData.splice(1, 1, { backgroundColor: "rgba(255,255,0,0.3)", borderColor: "#f5994e", data: dataforselectedLabel, label: selectedLabel.label, borderCapStyle: 'square', pointBackgroundColor: "white", pointBorderColor: "#2D9EE2" })
    }
    else {
      this.lineChartData.splice(1, 0, { backgroundColor: "rgba(255,255,0,0.3)", borderColor: "#f5994e", data: dataforselectedLabel, label: selectedLabel.label, borderCapStyle: 'square', pointBackgroundColor: "white", pointBorderColor: "#2D9EE2" })
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
    this.setCurrentSettingActive = event.settingActive
    this.settingActive = 1
    setTimeout(() => {
      this.disableTab()
    }, 500);

  }

  //using to open div on mouseover event
  public showDiv(event, value, show) {
    this.showdiv = value == 'true' ? true : false;
    this.show = show;

  }

  //using to view keyword list and also add new keyword
  goToKeywords(): void {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`])
  }

  public goToAddKeywords(): void {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`], {
      queryParams: {
        view: 'addKeyword'
      },
    })
  }

  // using to navigate to analytics overview page
  public goToAnalyticsOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics`])
  }
  // using to navigate to  overview page
  public goToCampaignOverview(event) {
    this.router.navigate(['/campaign', { id: this.selectedCampId }], {
      queryParams: {
        view: 'showReport'
      },
    });
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
  public convertToShortNumber(labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

      ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
      // Six Zeroes for Millions 
      : Math.abs(Number(labelValue)) >= 1.0e+6

        ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3

          ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

          : Math.abs(Number(labelValue));

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

  public changeDatesFormat(s, i) {
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
    return finaldate
  }
//For ranking graph rubina
RefreshRankingGraphData() {

  let p;
  let totalPosition = 0;
  p = this.serpList.filter(x => x.campaignID.toString() === this.selectedCampId.toLowerCase());
  if (p != null && p != undefined && p.length > 0) {
    for (let i = 0; i < p.length; i++) {
      totalPosition = totalPosition + p[i].position;
    }
  }
  this.averageRanking = totalPosition / parseInt(this.serpList.length)
  this.averageRanking = Math.round(this.averageRanking);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  const d = new Date();
  let currMonth = monthNames[d.getMonth()];
  let data = {
    id: "00000000-0000-0000-0000-000000000000",
    avragePosition: this.averageRanking,
    month: currMonth,
    campaignId: this.selectedCampId,
  }
  this.campaignService.createRankingGraph(data).subscribe(response => {
    if (response) {
      this.getRankingGraphData();
    }
  });
}
DeleteRankingGraphData() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const d = new Date();
  let currMonth = monthNames[d.getMonth()];
  let tempId;
  let p = this.tempRankingGraphData.filter(x => x.month == currMonth)
  if (p != null && p != undefined && p.length > 0) {
    tempId = p[0].id;
    this.campaignService.deleteRankingGraph(tempId).subscribe(response => {
      //if (response) {
      //this.snackbarService.show('Product Added');
      //}
    });
  }
  this.RefreshRankingGraphData();
}
getRankingGraphData() {
  //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
  const filterOptionModel = this.getFilterOptionPlans();
  this.campaignService.getFilteredRankingGraph(filterOptionModel).subscribe((response: any) => {
    if (response) {
      this.barDataArray = [];
      this.rankingGraphData = response.body;
      this.tempRankingGraphData = response.body;
      this.rankingGraphData.sort(function (a, b) {
        var MONTH = {
          January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
          July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        };
        return a.year - b.year || MONTH[a.month] - MONTH[b.month];
      });
      
      let u =  this.rankingGraphData;
      let p = u.filter(x => x.month == "January")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }

      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "February")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "March")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "April")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "May")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "June")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "July")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "August")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "September")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "October")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "November")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }
      u =  this.rankingGraphData;
      p = this.rankingGraphData.filter(x => x.month == "December")
      if (p != null && p != undefined && p.length > 0) {
        this.barDataArray.push(p[0].avragePosition)
      }
      else { this.barDataArray.push(0) }


      this.barData.datasets[0].data = this.barDataArray;
      this.chart.chart.update();
    }
  })
}
public getSerpList(): void {
  debugger
  this.campaignService.getSerp("&tbs=qdr:m").subscribe(res => {
debugger
    this.serpList = res;
    //this.source = new LocalDataSource(this.serpList) 
    // var serpData = res.map((s, i) => {
    //   if (s.position > 0 && s.position <= 3) {
    //     var positions = []
    //     for (var x = 0; x < 12; x++) {
    //       this.barData.datasets[0].data.push(s.position)
    //     }
    //   }
    //   else if (s.position > 3 && s.position <= 10) {
    //     this.barData.datasets[1].data = s.position
    //   }
    //   else if (s.position > 10 && s.position <= 20) {
    //     this.barData.datasets[2].data = s.position
    //   }
    //   else if (s.position > 20 && s.position <= 50) {
    //     this.barData.datasets[3].data = s.position
    //   }
    //   else if (s.position > 50 && s.position <= 100) {
    //     this.barData.datasets[4].data = s.position
    //   }
    //   else if (s.position > 100) {
    //     this.barData.datasets[5].data = s.position
    //   }

    // })
    this.chart.chart.update();
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
//------------------GSC data start---------------------------------------------
signInWithGoogle(): void {
  const googleLoginOptions = {
    scope: 'profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters'
  };
  this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
    .then((res) => {
      
      this.accessToken = res['authToken'];
      localStorage.setItem('googleGscAccessToken', this.accessToken );
      this.isShowLoginButton = false;
      this.getData();
//this.getAdsData();
    })
}
getDataByDevice(startDate, endDate) {

  this.httpOptionJSON = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
    const url = "https://www.googleapis.com/webmasters/v3/sites/https:%2F%2F" + urlcamp + "%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
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
      this.barDataImpressionsDevice.datasets[0].data = [];
      this.barChartLabelsDevice = [];
      for (let i = 0; i < rows.length; i++) {
        this.barDataImpressionsDevice.datasets[0].data.push(rows[i].impressions);
        this.barDataClicksDevice.datasets[0].data.push(rows[i].clicks);
        this.barDataPositionDevice.datasets[0].data.push(rows[i].position);

        this.barChartLabelsDevice.push(rows[i].keys[0]);
      }
    }
  }, error => {
    alert('Data fetch failed by device : ' + JSON.stringify(error.error));
  });
}
getDataCurrentYear(startDate, endDate, all) {

  this.httpOptionJSON = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  debugger
  let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
  const url = "https://www.googleapis.com/webmasters/v3/sites/https:%2F%2F" + urlcamp + "%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
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
        this.barDataClicks.datasets[0].data = [];
        this.barDataImpressions.datasets[0].data = [];
        this.barDataCTR.datasets[0].data = [];
        this.barDataPositions.datasets[0].data = [];
        this.barChartLabels = [];
        for (let i = 0; i < rows.length; i++) {
          this.currDate = rows[i].keys[0]
          this.currDate = this.currDate.substring(5, 10);
          this.barDataClicks.datasets[0].data.push(rows[i].clicks);
          this.barDataImpressions.datasets[0].data.push(rows[i].impressions);
          this.barDataCTR.datasets[0].data.push(rows[i].ctr);
          this.barDataPositions.datasets[0].data.push(rows[i].position);
          this.barChartLabels.push(this.currDate);
        }
      }
    }
  }, error => {

    alert('Data fetch failed for current year : ' + JSON.stringify(error.error));
  });

}
getDataPreviousYear(startDate, endDate, all) {
debugger
  this.httpOptionJSON = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };

  let urlcamp = this.selectedCampIdWebUrl.replace('/', '%2F');
  const url = "https://www.googleapis.com/webmasters/v3/sites/https:%2F%2F" + urlcamp + "%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
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
        this.percentImpressions = this.getYearwiseDifference(this.impressionsPreviousYear, this.impressionsThisYear);
        this.percentPosition = this.getYearwiseDifference(this.positionPreviousYear, this.positionThisYear);
        this.percentCTR = this.getYearwiseDifference(this.cTRPreviousYear, this.cTRThisYear);
      }
      else {
        this.dateListData = [];
        this.barDataClicks.datasets[1].data = [];
        this.barDataImpressions.datasets[1].data = [];
        this.barChartLabels = [];
        for (let i = 0; i < rows.length; i++) {
          this.currDate = rows[i].keys[0]
          this.currDate = this.currDate.substring(5, 10);
          this.barDataClicks.datasets[1].data.push(rows[i].clicks + 10);
          this.barDataImpressions.datasets[1].data.push(rows[i].impressions);
          this.barDataCTR.datasets[1].data.push(rows[i].ctr);
          this.barDataPositions.datasets[1].data.push(rows[i].position);

          this.barChartLabels.push(this.currDate);
        }
      }
    }
  }, error => {

    alert('Data fetch failed for previous year : ' + JSON.stringify(error.error));
  });

}

onStartDateChange(event) {
  this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
  this.currYear = parseInt(this.datepipe.transform(this.fromDate.value, 'yyyy'));
  let prevYear = this.currYear - 1;
  this.previousStartDate = prevYear.toString() + '-' + this.datepipe.transform(this.fromDate.value, 'MM-dd');
  this.getData();
}

onEndDateChange(event) {
  this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
  this.currYear = parseInt(this.datepipe.transform(this.toDate.value, 'yyyy'));
  let prevYear = this.currYear - 1;
  this.previousEndDate = prevYear.toString() + '-' + this.datepipe.transform(this.toDate.value, 'MM-dd');
  this.getData();
}
getData() {
debugger
  if (this.accessToken == '' || this.accessToken == undefined || this.accessToken == null) {
    alert("Please, Login with Google to fetch data");
  } else if (parseDate(this.endDate) < parseDate(this.startDate)) {
    alert("Start Date can not be grater then End Date");
  }
  else {
    this.getDataCurrentYear(this.startDate, this.endDate, 0);
    this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, 0);
    this.getDataCurrentYear(this.startDate, this.endDate, 1);
    this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, 1);
    this.getDataByDevice(this.startDate, this.endDate)
  }
}
getDateSettings() {
debugger
let currDate = new Date();
this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
currDate = new Date();
this.previousEndDate =  this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');

  // this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
  // this.currYear = parseInt(this.datepipe.transform(this.fromDate.value, 'yyyy'));
  // let prevYear = this.currYear - 1;
  // this.previousStartDate = prevYear.toString() + '-' + this.datepipe.transform(this.fromDate.value, 'MM-dd');
  // this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
  // this.currYear = parseInt(this.datepipe.transform(this.toDate.value, 'yyyy'));
  // prevYear = this.currYear - 1;
  // this.previousEndDate = prevYear.toString() + '-' + this.datepipe.transform(this.toDate.value, 'MM-dd');
}

getYearwiseDifference(previous, current) {
  
  let diff = ((parseFloat(previous) - parseFloat(current)) * 100) / parseFloat(previous)
  return parseFloat(diff.toString()).toFixed(2)

}
getPercentage(num, total) {
  return ((100 * num) / total)
}
//#################  GSC data end ###########################################
}
