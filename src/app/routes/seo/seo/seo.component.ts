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
import { environment } from '../../../../environments/environment';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';

const success = require('sweetalert');
@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss']
})
export class SeoComponent implements OnInit {


  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild(BaseChartDirective)
  period = "28Days";
  integrateGSCAccount: boolean = false;
  integrateGAAccount: boolean = false;
  //for keyword listing
  source: LocalDataSource;
  //variable passed from campaign list
  tempDate = new Date();
  gaurl;
  gaaccesstoken;
  gadsurl;
  gadsaccesstoken;
  facebookurl;
  facebookaccesstoken;
  gscurl;
  gscaccesstoken;
  garefreshtoken;
  gscrefreshtoken;
  //variable passed from campaign list end
  //############# Site Speed start############################

  performanceScore;
  performanceScoreDesktop;
  showGreenZoneScore: boolean = false;
  showYellowZoneScore: boolean = false;
  showRedZoneScore: boolean = false;
  showMobileScore: boolean = false;
  showDesktopScore: boolean = false;
  showRedZoneScoreDesktop;
  showYellowZoneScoreDesktop;
  showGreenZoneScoreDesktop;
  pieOptions2 = {
    animate: {
      duration: 800,
      enabled: true
    },
    barColor: 'red',
    trackColor: 'rgba(200,200,200,0.4)',
    scaleColor: false,
    lineWidth: 10,
    lineCap: 'round',
    size: 125
  };
  pieOptions3 = {
    animate: {
      duration: 800,
      enabled: true
    },
    barColor: 'red',
    trackColor: 'rgba(200,200,200,0.4)',
    scaleColor: false,
    lineWidth: 10,
    lineCap: 'round',
    size: 125
  };
  //for loding
  CUMULATIVE_LAYOUT_SHIFT_SCORE
  FIRST_CONTENTFUL_PAINT_MS
  FIRST_INPUT_DELAY_MS
  LARGEST_CONTENTFUL_PAINT_MS
  //for light house
  //for mobile
  interactive
  //first_cpu_idle
  first_contentful_paint
  speed_index
  //first_meaningful_paint
  //Eestimated_input_latency
  largest_contentful_paint
  total_blocking_time
  cumulative_layout_shift

  //for deskto[]
  interactive_Desktop
  //first_cpu_idle_Desktop
  first_contentful_paint_Desktop
  speed_index_Desktop
  //first_meaningful_paint_Desktop
  //Eestimated_input_latency_Desktop
  largest_contentful_paint_Desktop
  total_blocking_time_Desktop
  cumulative_layout_shift_Desktop
  //for sitespeed table-showing icons-red,green,orange 
  showGreenZoneFCP: boolean;
  showOrangezoneFCP: boolean;
  showRedZoneFCP: boolean;
  showGreenZoneSI: boolean;
  showOrangezoneSI: boolean;
  showRedZoneSI: boolean
  showGreenZoneLCP: boolean;
  showOrangezoneLCP: boolean;
  showRedZoneLCP: boolean
  showGreenZoneTOT: boolean;
  showOrangezoneTOT: boolean;
  showRedZoneTOT: boolean
  showGreenZoneTBT: boolean;
  showOrangezoneTBT: boolean;
  showRedZoneTBT: boolean
  showGreenZoneCLS: boolean;
  showOrangezoneCLS: boolean;
  showRedZoneCLS: boolean;
  //variables for desktop
  showGreenZoneFCP_Desktop: boolean;
  showOrangezoneFCP_Desktop: boolean;
  showRedZoneFCP_Desktop: boolean;
  showGreenZoneSI_Desktop: boolean;
  showOrangezoneSI_Desktop: boolean;
  showRedZoneSI_Desktop: boolean
  showGreenZoneLCP_Desktop: boolean;
  showOrangezoneLCP_Desktop: boolean;
  showRedZoneLCP_Desktop: boolean
  showGreenZoneTOT_Desktop: boolean;
  showOrangezoneTOT_Desktop: boolean;
  showRedZoneTOT_Desktop: boolean
  showGreenZoneTBT_Desktop: boolean;
  showOrangezoneTBT_Desktop: boolean;
  showRedZoneTBT_Desktop: boolean
  showGreenZoneCLS_Desktop: boolean;
  showOrangezoneCLS_Desktop: boolean;
  showRedZoneCLS_Desktop: boolean;

  //############# Site Speed end############################

  //Ranking graph rubina
  rankingGraphData;
  tempRankingGraphData = [];
  averageRanking;
  serpList;
  tempSerpList = [];
  keywordTableList = [];
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
  fromDate = new FormControl(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000))
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
        data: [], label: 'This Period', legend: false, fill: false
      }, {
        data: [], label: 'Previous Period', legend: false, fill: false,
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
        data: [], label: 'This Period', legend: false, fill: false
      }, {
        data: [], label: 'Previous Period', legend: false, fill: false,
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
        data: [], label: 'This Period', legend: false, fill: false
      }, {
        data: [], label: 'Previous Period', legend: false, fill: false,
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
        data: [], label: 'This Period', legend: false, fill: false
      }, {
        data: [], label: 'Previous Period', legend: false, fill: false,
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
      'Social'
    ],
    datasets: [{
      data: [130, 65, 40, 15]
    }, {
      data: [130, 65, 40, 15]
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
      data: [130, 65, 40], label: 'This Period'
    }, {
      data: [12, 45, 450], label: 'Previous Period'
    }],
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
  showSpinnerSiteSpeedContent = true;
  googleAnalyticsAccountSetupList: GoogleAnalyticsAccountSetups[];
  activeAccount: any;
  hasActiveAccount: boolean = false;
  authorizeGaAccounts: any;
  hasAuthorize: boolean;
  reportsData: any;
  settings = {
    actions: {
      add: false, edit: false, delete: false, position: 'right'
    },
    columns: {
      keywords: {
        title: 'Keyword Phrase',
        filter: false
      },
      position: {
        title: 'Cur. Position',
        filter: false
      },
      prevposition: {
        title: 'Pre. Position',
        filter: false
      },
      searches: {
        title: 'Searches',
        valuePrepareFunction: (searches) => {
          return this.convertToShortNumber(searches)
        },
        filter: false
      },
      locationName: {
        title: 'Locations',
        filter: false
      }
    }
  };

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
    { data: [], label: 'This Slab', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    { data: [], label: 'Previous Slab', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    // { data: [], label: 'Referral', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    // { data: [], label: 'Paid', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
    // { data: [], label: 'Others', borderCapStyle: 'square', lineTension: 0, pointRadius: 0, },
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
          return tooltipItems.yLabel + ' Position'
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
  isAuthorized = false;

  // to show GA & GSC Integration Button
  ifGscChartShow: boolean = false;
  ifGaChartShow: boolean = false;
  constructor(private translate: TranslateService, fb: FormBuilder,
    private campaignService: CampaignService, private openIdConnectService: OpenIdConnectService,
    public route: ActivatedRoute, public router: Router, private integrationsService: IntegrationsService
    , private overvieswService: OverviewService, location: PlatformLocation,
    public auditsService: AuditsService, private http: HttpClient, public datepipe: DatePipe, private authService: SocialAuthService, private settingService: SettingsService,
    private snackbarService: SnackbarService) {



    this.campaignModel = new Campaign();
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    // this.getGaSetupByCampaignId();
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    ;
    // this.getGaSetupByCampaignId();
    //this.getAnalyticsData();
    // this.getCampaignList();
    this.getSerpList();
    //this.getRankingGraphDataDelete();
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
  GetRankingPosition(selectedCampId) {
    this.tempSerpList = this.serpList;
    let p;
    //this slab
    p = this.tempSerpList.filter(x => x.campaignID.toString() === selectedCampId.toLowerCase());
    if (p.length > 0) {
      p = p.filter(x => (new Date(x.createdOn) <= new Date(this.toDate.value) && new Date(x.createdOn) >= new Date(this.fromDate.value)));
      p = this.sortData(p);
      if (p.length > 0) {
        let maxDate = p[0].createdOn;
        p = p.filter(x => this.datepipe.transform(x.createdOn, 'yyyy-MM-dd') == this.datepipe.transform(maxDate, 'yyyy-MM-dd'));

        if (p != null && p != undefined && p.length > 0) {
          this.keywordTableList = p;

          for (let i = 0; i < p.length; i++) {
            // this.addColumn("keywords",p[i].keywords,i);
            // this.addColumn("position",p[i].position,i);
            // this.addColumn("searches",p[i].searches,i);
            // this.addColumn("location",p[i].location,i);
            //  keywords,position,prevposition,searches,location
            // this.keywordTableList[i].keywords
            // this.keywordTableList.push("keywords",p[i].keywords);
            // this.keywordTableList.push("position",p[i].position);
            // this.keywordTableList.push("searches",p[i].searches);
            // this.keywordTableList.push("location",p[i].location);
          }
        }
      } else {
      }
    }
    else {
    }
    //Previous slab
    this.tempSerpList = this.serpList;
    p = this.tempSerpList.filter(x => x.campaignID.toString() === selectedCampId.toLowerCase());
    if (p.length > 0) {
      p = p.filter(x => (new Date(x.createdOn) <= new Date(this.previousEndDate) && new Date(x.createdOn) >= new Date(this.previousStartDate)));
      p = this.sortData(p);
      if (p.length > 0) {
        let maxDate = p[0].createdOn;
        p = p.filter(x => this.datepipe.transform(x.createdOn, 'yyyy-MM-dd') == this.datepipe.transform(maxDate, 'yyyy-MM-dd'));
        if (p != null && p != undefined && p.length > 0) {
          for (let i = 0; i < p.length; i++) {
            this.keywordTableList[i].prevposition = p[i].position
          }
        }
      } else {
      }
    }
    else {
    }
  }
  public addColumn(title, value, index) {

    this.settings.columns["new column " + index] = { title: title, value: value };
    this.settings = Object.assign({}, this.settings);
  }
  sortData(p) {
    return p.sort((a, b) => {
      return <any>new Date(b.createdOn) - <any>new Date(a.createdOn);
    });
  }
  checkqueryparams() {
    var params = { ...this.route.snapshot.queryParams };
    this.queryParams = params.view
    delete params.view;
    this.router.navigate([], { queryParams: params });
    this.settingActive = 3;
    //this.getAnalyticsData();
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
  refreshGSCAccount() {

    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: this.gscrefreshtoken,//'ya29.a0AfH6SMCszj8kAk7Q4lV43Q0vsJWDKmmmYkSYnwPclmY1La7BesHF7-5KuwdX1s4MlllQafsCGCjmQ9oO3K4jtFB6wMvDiuWjRsYpGQxkKzpwoUvph8e5OWG_Fy0bCUYAe_NiJ0x8gUkhM98seOhBPvNE1znZ',
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {
        this.gscaccesstoken = res['access_token'];
        this.getData();
      }
    }, error => {
      // alert('Gsc : ' + JSON.stringify(error.error));
      if (error) {
        this.snackbarService.show(" " + this.gscurl + " : Please re-integrate!! The access token has expired. ");
      }
    });
  }
  refreshGoogleAnalyticsAccount() {

    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: this.garefreshtoken,// 'ya29.a0AfH6SMCszj8kAk7Q4lV43Q0vsJWDKmmmYkSYnwPclmY1La7BesHF7-5KuwdX1s4MlllQafsCGCjmQ9oO3K4jtFB6wMvDiuWjRsYpGQxkKzpwoUvph8e5OWG_Fy0bCUYAe_NiJ0x8gUkhM98seOhBPvNE1znZ',
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {
        this.gaaccesstoken = res['access_token'];
        this.getAnalyticsProfileIds();
        this.getSiteSpeedDataMobile();
        this.getSiteSpeedDataDesktop();
      }
    }, error => {
      // alert('GA : ' + JSON.stringify(error.error));
      if (error) {
        this.snackbarService.show(" " + this.gaurl + " : Please re-integrate!! The access token has expired. ");
      }
    });

  }

  ngOnInit(): void {

    ;

    this.loadSeoPage();

  }
  loadSeoPage() {
    this.gaurl = localStorage.getItem('gaurl');
    this.gaaccesstoken = localStorage.getItem('gaaccesstoken');
    this.garefreshtoken = localStorage.getItem('garefreshtoken');
    this.gadsurl = localStorage.getItem('gadsurl');
    this.gadsaccesstoken = localStorage.getItem('gadsaccesstoken');
    this.gscurl = localStorage.getItem('gscurl');
    this.gscaccesstoken = localStorage.getItem('gscaccesstoken');
    this.gscrefreshtoken = localStorage.getItem('gscrefreshtoken');
    this.selectedCampaignName = localStorage.getItem('selectedCampName');
    this.selectedCampIdWebUrl = localStorage.getItem('selectedCampUrl');
    if (this.gaurl != 'null' && this.gaurl != null && this.gaurl != undefined && this.gaurl != '') {
      this.ifGaChartShow = true;
      this.refreshGoogleAnalyticsAccount();
    }
    else {
      this.ifGaChartShow = false;
    }
    if (this.gscurl != 'null' && this.gscurl != null && this.gscurl != undefined && this.gscurl != '') {
      this.ifGscChartShow = true;
      this.getDateSettings();
      this.refreshGSCAccount();
    }
    else {
      this.ifGscChartShow = false;
    }
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
  calculateObjectTotal(obj) {

    let total = 0;
    if (obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        total = parseInt(total.toString()) + parseInt(obj[i].toString());
      }
    }
    return total;
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
      this.getSelectedCampaignWebsiteAuditReportData()
      this.accessToken = localStorage.getItem('googleGscAccessToken');
      if (this.accessToken != null && this.accessToken != undefined && this.accessToken != '') {

        this.getAnalyticsProfileIds();
        this.getData();
        this.getSiteSpeedDataMobile();
        this.getSiteSpeedDataDesktop();

      } else {
        this.isShowLoginButton = true;
      }
    });




  }
  getAnalyticsProfileIds() {
    ;
    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.gaurl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/management/accountSummaries";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        ;
        let rows = res['items'];
        //let accountSummaryIds=[];
        for (let i = 0; i < rows.length; i++) {

          let p = rows[i]
          let q = p['webProperties']['0'].websiteUrl.toString();
          if (q.includes(this.gaurl)) {
            this.getAnalyticsOrganicTraffic(rows[i].webProperties[0].profiles[0].id, this.startDate, this.endDate);
            this.getAnalyticsOrganicTrafficPrevious(rows[i].webProperties[0].profiles[0].id, this.previousStartDate, this.previousEndDate);
            this.getAnalyticsTrafficByChannel(rows[i].webProperties[0].profiles[0].id, this.startDate, this.endDate);
            this.getAnalyticsTrafficByChannelPrevious(rows[i].webProperties[0].profiles[0].id, this.previousStartDate, this.previousEndDate);
            break;
          }
          // accountSummaryIds.push(rows[i].webProperties[0].profiles[0].id);
        }

      }
    }, error => {
      ;
      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsOrganicTrafficPrevious(profileid, startdate, endDate) {

    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.gaurl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&dimensions=ga:date&start-date=" + startdate + "&end-date=" + endDate + "&metrics=ga:organicsearches";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        this.showSpinnerBaseChart = false;
        this.lineChartData1[1].data = [];
        // this.lineChartLabels1 = [];
        for (let i = 0; i < rows.length; i++) {
          this.lineChartData1[1].data.push(rows[i]["1"]);
          let dt = rows[i]["0"].toString().substring(4, 6) + '-' + rows[i]["0"].toString().substring(6, 8);
          // this.lineChartLabels1.push(dt);
        }

      }
    }, error => {

      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsTrafficByChannelPrevious(profileid, startdate, endDate) {
    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.gaurl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + startdate + "&end-date=" + endDate + "&metrics=ga%3Asessions&dimensions=ga%3Asource%2Cga%3Amedium%2Cga%3AadContent%2Cga%3AsocialNetwork%2Cga%3AdeviceCategory"

    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        let organic = 0, referral = 0, social = 0, desktop = 0, mobile = 0, tablet = 0;
        this.showSpinnerSiteAnalysisContent = false;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["1"] == 'organic') {
            organic = organic + parseInt(rows[0]["5"]);//Organic Search
          }
          if (rows[i]["1"] == 'referral') {
            referral = referral + parseInt(rows[0]["5"]);//referral
          }
          if (rows[i]["3"] != '(not set)') {
            social = social + parseInt(rows[0]["5"]);//social
          }
          if (rows[i]["4"] == 'mobile') {
            mobile = mobile + parseInt(rows[0]["5"]);//mobile
          }
          if (rows[i]["4"] == 'desktop') {
            desktop = desktop + parseInt(rows[0]["5"]);//desktop
          }
          if (rows[i]["4"] == 'tablet') {
            tablet = tablet + parseInt(rows[0]["5"]);//desktop
          }
        }
        //Web traffic by channel
        this.doughnutData.datasets[1].data = [];
        let direct = parseInt(rows[1]["5"]) + parseInt(rows[0]["5"]) + parseInt(rows[0]["5"]);
        this.doughnutData.datasets[1].data.push(direct);//direct
        this.doughnutData.datasets[1].data.push(organic);//rganic Search
        this.doughnutData.datasets[1].data.push(referral);//referral
        this.doughnutData.datasets[1].data.push(social);//social
        //Web traffic by device
        this.doughnutData1.datasets[1].data = [];
        this.doughnutData1.datasets[1].data.push(desktop);//desktop
        this.doughnutData1.datasets[1].data.push(desktop);//mobile
        this.doughnutData1.datasets[1].data.push(desktop);//teblet
      }
    }, error => {
      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsOrganicTraffic(profileid, startdate, endDate) {

    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.gaurl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&dimensions=ga:date&start-date=" + startdate + "&end-date=" + endDate + "&metrics=ga:organicsearches";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        this.showSpinnerBaseChart = false;
        this.lineChartData1[0].data = [];
        this.lineChartLabels1 = [];
        for (let i = 0; i < rows.length; i++) {
          this.lineChartData1[0].data.push(rows[i]["1"]);
          let dt = rows[i]["0"].toString().substring(4, 6) + '-' + rows[i]["0"].toString().substring(6, 8);
          this.lineChartLabels1.push(dt);
        }

      }
    }, error => {

      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsTrafficByChannel(profileid, startdate, endDate) {

    let currDate = new Date();
    let endDate1 = this.datepipe.transform(currDate, 'yyyy-MM-dd');
    let startDate1 = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.gaurl.replace('/', '%2F');
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + startdate + "&end-date=" + endDate + "&metrics=ga%3Asessions&dimensions=ga%3Asource%2Cga%3Amedium%2Cga%3AadContent%2Cga%3AsocialNetwork%2Cga%3AdeviceCategory"

    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        let organic = 0, referral = 0, social = 0, desktop = 0, mobile = 0, tablet = 0;
        this.showSpinnerSiteAnalysisContent = false;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["1"] == 'organic') {
            organic = organic + parseInt(rows[0]["5"]);//Organic Search
          }
          if (rows[i]["1"] == 'referral') {
            referral = referral + parseInt(rows[0]["5"]);//referral
          }
          if (rows[i]["3"] != '(not set)') {
            social = social + parseInt(rows[0]["5"]);//social
          }
          if (rows[i]["4"] == 'mobile') {
            mobile = mobile + parseInt(rows[0]["5"]);//mobile
          }
          if (rows[i]["4"] == 'desktop') {
            desktop = desktop + parseInt(rows[0]["5"]);//desktop
          }
          if (rows[i]["4"] == 'tablet') {
            tablet = tablet + parseInt(rows[0]["5"]);//desktop
          }
        }
        //Web traffic by channel
        this.doughnutData.datasets[0].data = [];
        let direct = parseInt(rows[0]["5"]) + parseInt(rows[0]["5"]) + parseInt(rows[0]["5"]);
        this.doughnutData.datasets[0].data.push(direct);//direct
        this.doughnutData.datasets[0].data.push(organic);//rganic Search
        this.doughnutData.datasets[0].data.push(referral);//referral
        this.doughnutData.datasets[0].data.push(social);//social
        //Web traffic by device
        this.doughnutData1.datasets[0].data = [];
        this.doughnutData1.datasets[0].data.push(desktop);//desktop
        this.doughnutData1.datasets[0].data.push(mobile);//mobile
        this.doughnutData1.datasets[0].data.push(tablet);//teblet
      }
    }, error => {
      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
    });
  }
  getAnalyticsTrafficByDevice(profileid, startdate, endDate) {

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
    const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:" + profileid + "&start-date=" + startdate + "&end-date=" + endDate + "&metrics=ga%3Asessions&dimensions=ga%3Asource%2Cga%3Amedium%2Cga%3AadContent%2Cga%3AsocialNetwork"
    //const url = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:"+profileid+"&dimensions=ga:date&start-date="+startdate+"&end-date="+endDate+"&metrics=ga:organicsearches";

    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];
        let organic = 0, referral = 0, social = 0;
        this.showSpinnerSiteAnalysisContent = false;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["1"] == 'organic') {
            organic = organic + parseInt(rows[0]["4"]);//Organic Search
          }
          if (rows[i]["1"] == 'referral') {
            referral = referral + parseInt(rows[0]["4"]);//referral
          }
          if (rows[i]["3"] != '(not set)') {
            social = social + parseInt(rows[0]["4"]);//social
          }
        }
        this.doughnutData.datasets[0].data = [];
        this.doughnutData.datasets[0].data.push(rows[0]["4"]);//direct
        this.doughnutData.datasets[0].data.push(organic);//rganic Search
        this.doughnutData.datasets[0].data.push(referral);//referral
        this.doughnutData.datasets[0].data.push(social);//social
      }
    }, error => {
      //alert('Analytics Data Fetch failed : ' + JSON.stringify(error.error));
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
    //this.getSelectedCampaignWebsiteAuditReportData()
    //this.getAnalyticsData();
  }

  onSearch(query: string = '') {
    if (query == "") {
      this.source = new LocalDataSource(this.serpList)
    }
    else {
      this.source.setFilter([
        // fields we want to include in the search
        {
          field: 'keywords',
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

  //using to check setup and get analytics data with selected campaign Id
  userRowSelect(campaign: any): void {

    this.selectedCampaignName = campaign.data.name
    this.selectedCampId = campaign.data.id
    this.router.navigate(['/campaign', { id: campaign.data.id }]);
    this.settingActive = 3
    this.selectedCampIdWebUrl = campaign.data.webUrl


    // this.getSelectedCampaignWebsiteAuditReportData()
    //this.getGaSetupByCampaignId();
    //this.getAnalyticsData();

  }
  onSelect(period1) {

    this.period = period1;
    let currDate = new Date();
    if (period1 == "28Days") {


      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
      currDate = new Date();
      this.previousEndDate = this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 28), 'yyyy-MM-dd');
    }
    if (period1 == "week") {


      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 7), 'yyyy-MM-dd');
      currDate = new Date();
      this.previousEndDate = this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 7), 'yyyy-MM-dd');
    }
    if (period1 == "day") {


      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 1), 'yyyy-MM-dd');
      currDate = new Date();
      this.previousEndDate = this.datepipe.transform(currDate.setFullYear(currDate.getFullYear() - 1), 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setDate(currDate.getDate() - 1), 'yyyy-MM-dd');
    }
    this.getData();
    this.getAnalyticsProfileIds();
    //this.getAnalyticsData();
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
    //this.getAnalyticsData();
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

    const d = new Date();
    let currYear = d.getFullYear();
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
    if (this.averageRanking == null) { this.averageRanking = 0; }
    let currMonth = monthNames[d.getMonth()];
    let data = {
      id: "00000000-0000-0000-0000-000000000000",
      avragePosition: this.averageRanking,
      month: currMonth,
      campaignId: this.selectedCampId,
      year: currYear,
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

        this.RefreshRankingGraphData();
      });
    } else {
      this.RefreshRankingGraphData();
    }
  }
  getRankingGraphDataDelete() {

    const d = new Date();
    let currYear = d.getFullYear();
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOptionPlans();
    this.campaignService.getFilteredRankingGraph(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.barDataArray = [];
        this.rankingGraphData = response.body;
        this.rankingGraphData = this.rankingGraphData.filter(x => x.campaignId.toString() === this.selectedCampId.toLowerCase() && x.year == currYear);
        this.tempRankingGraphData = this.rankingGraphData;
        this.DeleteRankingGraphData();

      }
    });
  }
  getRankingGraphData() {

    const d = new Date();

    let currYear = d.getFullYear();
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOptionPlans();
    this.campaignService.getFilteredRankingGraph(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.barDataArray = [];
        this.rankingGraphData = response.body;
        this.rankingGraphData = this.rankingGraphData.filter(x => x.campaignId.toString() === this.selectedCampId.toLowerCase() && x.year == currYear);
        this.tempRankingGraphData = this.rankingGraphData;
        this.rankingGraphData.sort(function (a, b) {
          var MONTH = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
          };
          return a.year - b.year || MONTH[a.month] - MONTH[b.month];
        });

        let u = this.rankingGraphData;
        let p = u.filter(x => x.month == "January")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }

        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "February")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "March")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "April")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "May")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "June")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "July")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "August")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "September")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "October")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "November")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        u = this.rankingGraphData;
        p = this.rankingGraphData.filter(x => x.month == "December")
        if (p != null && p != undefined && p.length > 0) {
          this.barDataArray.push(p[0].avragePosition)
        }
        else { this.barDataArray.push(0) }
        this.barData.datasets[0].data = this.barDataArray;

        // this.chart.chart.update();
      }
    })
  }
  // public getSerpList(): void {

  //   this.campaignService.getSerp("&tbs=qdr:m").subscribe(res => {

  //     this.serpList = res;
  //   });
  // }
  public getSerpList(): void {
    ;
    const filterOptionModel = this.getFilterOptionPlans();
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    filterOptionModel.searchQuery = 'CampaignID=="' + this.selectedCampId + '"'
    this.campaignService.getSerpForKeyword(filterOptionModel, "&tbs=qdr:m").subscribe(res => {

      this.serpList = res;
      this.tempSerpList = this.serpList;
      this.GetRankingPosition(this.selectedCampId);
      this.source = new LocalDataSource(this.keywordTableList)
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
  getSiteSpeedDataMobile() {
    ;
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.selectedCampIdWebUrl.replace('https://', '');
    urlcamp = urlcamp.replace('http://', '');
    urlcamp = urlcamp.replace('/', '');

    const url = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2F" + urlcamp + "&strategy=MOBILE&key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        //FCP 2320 green
        this.showSpinnerSiteSpeedContent = false;
        let rows = res['loadingExperience'].metrics;
        let lighthouse = res['lighthouseResult'];
        //load expeience
        // this.CUMULATIVE_LAYOUT_SHIFT_SCORE = rows['CUMULATIVE_LAYOUT_SHIFT_SCORE'].category
        //this.FIRST_CONTENTFUL_PAINT_MS= rows['FIRST_CONTENTFUL_PAINT_MS'].category
        //this.FIRST_INPUT_DELAY_MS= rows['FIRST_INPUT_DELAY_MS'].category
        //this.LARGEST_CONTENTFUL_PAINT_MS= rows['LARGEST_CONTENTFUL_PAINT_MS'].category
        //light house


        // this.first_contentful_paint = lighthouse.audits['first-contentful-paint'].displayValue,
        // this.speed_index = lighthouse.audits['speed-index'].displayValue,
        // this.interactive = lighthouse.audits['interactive'].displayValue,
        // this.first_meaningful_paint = lighthouse.audits['first-meaningful-paint'].displayValue,
        // this.first_cpu_idle = lighthouse.audits['first-cpu-idle'].displayValue,
        // this.Eestimated_input_latency = lighthouse.audits['estimated-input-latency'].displayValue
        ;
        this.first_contentful_paint = lighthouse.audits['first-contentful-paint'].displayValue;
        this.speed_index = lighthouse.audits['speed-index'].displayValue;
        this.largest_contentful_paint = lighthouse.audits['largest-contentful-paint'].displayValue;
        this.interactive = lighthouse.audits['interactive'].displayValue;
        this.total_blocking_time = lighthouse.audits['total-blocking-time'].displayValue;
        this.cumulative_layout_shift = lighthouse.audits['cumulative-layout-shift'].displayValue

        let msFcp: any = lighthouse.audits['first-contentful-paint'].score * 100;
        let msSi: any = lighthouse.audits['speed-index'].score * 100;
        let msLcp: any = lighthouse.audits['largest-contentful-paint'].score * 100;
        let msToi: any = lighthouse.audits['interactive'].score * 100;
        let msTbt: any = lighthouse.audits['total-blocking-time'].score * 100;
        let msCls: any = lighthouse.audits['cumulative-layout-shift'].score * 100;

        this.performanceScore = ((msFcp * 0.15) + (msSi * 0.15) + (msLcp * 0.25) + (msToi * 0.15) + (msTbt * 0.25) + (msCls * 0.05));
        this.performanceScore = Math.round(this.performanceScore);

        this.showMobileScore = true;
        if (this.performanceScore >= 0 && this.performanceScore <= 49) {
          this.showRedZoneScore = true;
        }
        else if (this.performanceScore >= 50 && this.performanceScore <= 89) {
          this.showYellowZoneScore = true;
          this.pieOptions2.barColor = 'orange';
        }
        else {
          this.showGreenZoneScore = true;
          this.pieOptions2.barColor = 'green';
        }

        var fcp: any = (parseFloat(this.first_contentful_paint) * 1000).toFixed(0).toString();
        var si: any = (parseFloat(this.speed_index) * 1000).toFixed(0);
        var lcp: any = (parseFloat(this.largest_contentful_paint) * 1000).toFixed(0);
        var tot: any = (parseFloat(this.interactive) * 1000).toFixed(0);
        var tbt: any = this.total_blocking_time.replace("ms", "");

        if (fcp < 2350) {

          //Icon
          this.showGreenZoneFCP = true;
          this.showOrangezoneFCP = false;
          this.showRedZoneFCP = false;

        } else if ((fcp < 4020) && (fcp > 2350)) {
          this.showOrangezoneFCP = true;
          this.showGreenZoneFCP = false;
          this.showRedZoneFCP = false;

        } else {
          this.showRedZoneFCP = true;
          this.showOrangezoneFCP = false;
          this.showGreenZoneFCP = false;
        }

        if ((si <= 3340)) {

          this.showGreenZoneSI = true;
          this.showOrangezoneSI = false;
          this.showRedZoneSI = false;
        } else if ((si > 3340) && (si < 5790)) {
          this.showOrangezoneSI = true;
          this.showGreenZoneSI = false;
          this.showRedZoneSI = false;
        } else {
          this.showRedZoneSI = true;
          this.showOrangezoneSI = false;
          this.showGreenZoneSI = false;
        }
        if ((lcp <= 2520)) {

          this.showGreenZoneLCP = true;
          this.showOrangezoneLCP = false;
          this.showRedZoneLCP = false;
        } else if ((lcp > 2520) && (lcp < 3990)) {
          this.showOrangezoneLCP = true;
          this.showGreenZoneLCP = false;
          this.showRedZoneLCP = false;
        } else {
          this.showRedZoneLCP = true;
          this.showOrangezoneLCP = false;
          this.showGreenZoneLCP = false;
        }
        if ((tot <= 3810)) {

          this.showGreenZoneTOT = true;
          this.showOrangezoneTOT = false;
          this.showRedZoneTOT = false;
        } else if ((tot > 3810) && (tot < 7310)) {
          this.showOrangezoneTOT = true;
          this.showGreenZoneTOT = false;
          this.showRedZoneTOT = false;
        } else {
          this.showRedZoneTOT = true;
          this.showOrangezoneTOT = false;
          this.showGreenZoneTOT = false;
        }
        if ((tbt <= 290)) {

          this.showGreenZoneTBT = true;
          this.showOrangezoneTBT = false;
          this.showRedZoneTBT = false;
        } else if ((tbt > 290) && (tbt < 600)) {
          this.showOrangezoneTBT = true;
          this.showGreenZoneTBT = false;
          this.showRedZoneTBT = false;
        } else {
          this.showRedZoneTBT = true;
          this.showOrangezoneTBT = false;
          this.showGreenZoneTBT = false;
        }
        if ((this.cumulative_layout_shift <= 0.10)) {

          this.showGreenZoneCLS = true;
          this.showOrangezoneCLS = false;
          this.showRedZoneCLS = false;
        } else if ((this.cumulative_layout_shift > 0.10) && (this.cumulative_layout_shift < 0.25)) {
          this.showOrangezoneCLS = true;
          this.showGreenZoneCLS = false;
          this.showRedZoneCLS = false;
        } else {
          this.showRedZoneCLS = true;
          this.showOrangezoneCLS = false;
          this.showGreenZoneCLS = false;
        }
        this.showSpinnerSiteAnalysisContent = false;
      }
    }, error => {

      //console.log('Data fetch failed by device : ' + JSON.stringify(error.error));
    });
  }

  getSiteSpeedDataDesktop() {
    ;
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gaaccesstoken,
      })
    };
    let urlcamp = this.selectedCampIdWebUrl.replace('https://', '');
    urlcamp = urlcamp.replace('http://', '');
    urlcamp = urlcamp.replace('/', '');
    //&strategy=DESKTOP
    const url = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2F" + urlcamp + "&strategy=DESKTOP&key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    // const url = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fpatwa.co.in&key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ"
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        //FCP 2320 green
        this.showSpinnerSiteSpeedContent = false;
        let rows = res['loadingExperience'].metrics;
        let lighthouse = res['lighthouseResult'];
        //load expeience
        // this.CUMULATIVE_LAYOUT_SHIFT_SCORE = rows['CUMULATIVE_LAYOUT_SHIFT_SCORE'].category
        //this.FIRST_CONTENTFUL_PAINT_MS= rows['FIRST_CONTENTFUL_PAINT_MS'].category
        //this.FIRST_INPUT_DELAY_MS= rows['FIRST_INPUT_DELAY_MS'].category
        //this.LARGEST_CONTENTFUL_PAINT_MS= rows['LARGEST_CONTENTFUL_PAINT_MS'].category
        //light house


        //this.first_contentful_paint = lighthouse.audits['first-contentful-paint'].displayValue,
        //this.speed_index = lighthouse.audits['speed-index'].displayValue,
        //this.interactive = lighthouse.audits['interactive'].displayValue,
        //this.first_meaningful_paint = lighthouse.audits['first-meaningful-paint'].displayValue,
        //this.first_cpu_idle = lighthouse.audits['first-cpu-idle'].displayValue,
        //this.Eestimated_input_latency = lighthouse.audits['estimated-input-latency'].displayValue
        this.first_contentful_paint_Desktop = lighthouse.audits['first-contentful-paint'].displayValue;
        this.speed_index_Desktop = lighthouse.audits['speed-index'].displayValue;
        this.largest_contentful_paint_Desktop = lighthouse.audits['largest-contentful-paint'].displayValue;
        this.interactive_Desktop = lighthouse.audits['interactive'].displayValue;
        this.total_blocking_time_Desktop = lighthouse.audits['total-blocking-time'].displayValue;
        this.cumulative_layout_shift_Desktop = lighthouse.audits['cumulative-layout-shift'].displayValue

        let msFcpDesktop: any = lighthouse.audits['first-contentful-paint'].score * 100;
        let msSiDesktop: any = lighthouse.audits['speed-index'].score * 100;
        let msLcpDesktop: any = lighthouse.audits['largest-contentful-paint'].score * 100;
        let msToiDesktop: any = lighthouse.audits['interactive'].score * 100;
        let msTbtDesktop: any = lighthouse.audits['total-blocking-time'].score * 100;
        let msClsDesktop: any = lighthouse.audits['cumulative-layout-shift'].score * 100;
        ;

        this.performanceScoreDesktop = ((msFcpDesktop * 0.15) + (msSiDesktop * 0.15) + (msLcpDesktop * 0.25) + (msToiDesktop * 0.15) + (msTbtDesktop * 0.25) + (msClsDesktop * 0.05));
        this.performanceScoreDesktop = Math.round(this.performanceScoreDesktop);

        this.showDesktopScore = true;
        if (this.performanceScoreDesktop >= 0 && this.performanceScoreDesktop <= 49) {
          this.showRedZoneScoreDesktop = true;
        }
        else if (this.performanceScoreDesktop >= 50 && this.performanceScoreDesktop <= 89) {
          this.showYellowZoneScoreDesktop = true;
          this.pieOptions3.barColor = 'orange';
        }
        else {
          this.showGreenZoneScoreDesktop = true;
          this.pieOptions3.barColor = 'green';
        }

        var fcp: any = (parseFloat(this.first_contentful_paint_Desktop) * 1000).toFixed(0).toString();
        var si: any = (parseFloat(this.speed_index_Desktop) * 1000).toFixed(0);
        var lcp: any = (parseFloat(this.largest_contentful_paint_Desktop) * 1000).toFixed(0);
        var tot: any = (parseFloat(this.interactive_Desktop) * 1000).toFixed(0);
        var tbt: any = this.total_blocking_time_Desktop.replace("ms", "");

        if (fcp < 930) {

          //Icon
          this.showGreenZoneFCP_Desktop = true;
          this.showOrangezoneFCP_Desktop = false;
          this.showRedZoneFCP_Desktop = false;

        } else if ((fcp < 1590) && (fcp > 930)) {
          this.showOrangezoneFCP_Desktop = true;
          this.showGreenZoneFCP_Desktop = false;
          this.showRedZoneFCP_Desktop = false;

        } else {
          this.showRedZoneFCP_Desktop = true;
          this.showOrangezoneFCP_Desktop = false;
          this.showGreenZoneFCP_Desktop = false;
        }

        if ((si <= 1290)) {

          this.showGreenZoneSI_Desktop = true;
          this.showOrangezoneSI_Desktop = false;
          this.showRedZoneSI_Desktop = false;
        } else if ((si > 1290) && (si < 2300)) {
          this.showOrangezoneSI_Desktop = true;
          this.showGreenZoneSI_Desktop = false;
          this.showRedZoneSI_Desktop = false;
        } else {
          this.showRedZoneSI_Desktop = true;
          this.showOrangezoneSI_Desktop = false;
          this.showGreenZoneSI_Desktop = false;
        }
        if ((lcp <= 1200)) {

          this.showGreenZoneLCP_Desktop = true;
          this.showOrangezoneLCP_Desktop = false;
          this.showRedZoneLCP_Desktop = false;
        } else if ((lcp > 1200) && (lcp < 2390)) {
          this.showOrangezoneLCP_Desktop = true;
          this.showGreenZoneLCP_Desktop = false;
          this.showRedZoneLCP_Desktop = false;
        } else {
          this.showRedZoneLCP_Desktop = true;
          this.showOrangezoneLCP_Desktop = false;
          this.showGreenZoneLCP_Desktop = false;
        }
        if ((tot <= 2470)) {

          this.showGreenZoneTOT_Desktop = true;
          this.showOrangezoneTOT_Desktop = false;
          this.showRedZoneTOT_Desktop = false;
        } else if ((tot > 2470) && (tot < 4510)) {
          this.showOrangezoneTOT_Desktop = true;
          this.showGreenZoneTOT_Desktop = false;
          this.showRedZoneTOT_Desktop = false;
        } else {
          this.showRedZoneTOT_Desktop = true;
          this.showOrangezoneTOT_Desktop = false;
          this.showGreenZoneTOT_Desktop = false;
        }
        if ((tbt <= 150)) {

          this.showGreenZoneTBT_Desktop = true;
          this.showOrangezoneTBT_Desktop = false;
          this.showRedZoneTBT_Desktop = false;
        } else if ((tbt > 150) && (tbt < 350)) {
          this.showOrangezoneTBT_Desktop = true;
          this.showGreenZoneTBT_Desktop = false;
          this.showRedZoneTBT_Desktop = false;
        } else {
          this.showRedZoneTBT_Desktop = true;
          this.showOrangezoneTBT_Desktop = false;
          this.showGreenZoneTBT_Desktop = false;
        }
        if ((this.cumulative_layout_shift_Desktop <= 0.10)) {

          this.showGreenZoneCLS_Desktop = true;
          this.showOrangezoneCLS_Desktop = false;
          this.showRedZoneCLS_Desktop = false;
        } else if ((this.cumulative_layout_shift_Desktop > 0.10) && (this.cumulative_layout_shift_Desktop < 0.25)) {
          this.showOrangezoneCLS_Desktop = true;
          this.showGreenZoneCLS_Desktop = false;
          this.showRedZoneCLS_Desktop = false;
        } else {
          this.showRedZoneCLS_Desktop = true;
          this.showOrangezoneCLS_Desktop = false;
          this.showGreenZoneCLS_Desktop = false;
        }
        this.showSpinnerSiteAnalysisContent = false;
      }
    }, error => {

      console.log('Data fetch failed by device : ' + JSON.stringify(error.error));
    });
  }
  //------------------GSC data start---------------------------------------------

  signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters'
    };
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
      .then((res) => {

        this.accessToken = res['authToken'];
        this.gscaccesstoken = res['authToken'];
        localStorage.setItem('googleGscAccessToken', this.accessToken);
        this.isShowLoginButton = false;
        this.getData();


        //this.getAdsData();
      })
  }
  getDataByDevice(startDate, endDate, url) {

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

      if (error.code == '401') {
        //alert('Session Expired, Please Login again to access system : ' + JSON.stringify(error.error));
      }
    });
  }
  getDataCurrentYear(startDate, endDate, url) {
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
      ;
      if (res) {
        ;
        let rows = res['rows'];
        this.clicksThisYear = rows[0].clicks;
        this.impressionsThisYear = rows[0].impressions;
        this.cTRThisYear = parseFloat(rows[0].ctr).toFixed(2).toString();
        this.positionThisYear = parseFloat(rows[0].position).toFixed(2).toString();
        this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, url);
      }
    }, error => {

      // alert('Data fetch failed for current year : ' + JSON.stringify(error.error));
    });

  }
  getDataPreviousYear(startDate, endDate, url) {
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gscaccesstoken,
      })
    };
    let data = {
      "startRow": 0,
      "startDate": startDate,
      "endDate": endDate,
      "dataState": "ALL"
    };
    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];

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
    }, error => {

      //alert('Data fetch failed for previous year : ' + JSON.stringify(error.error));
    });

  }
  getDataCurrentYearWithDate(startDate, endDate, url) {
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
      "dimensions": [
        "DATE"
      ]
    };

    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {

        let rows = res['rows'];

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
        this.getDataPreviousYearWithDate(this.previousStartDate, this.previousEndDate, url);
      }
    }, error => {

      // alert('Data fetch failed for current year : ' + JSON.stringify(error.error));
    });

  }
  getDataPreviousYearWithDate(startDate, endDate, url) {
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.gscaccesstoken,
      })
    };
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
    }, error => {

      //alert('Data fetch failed for previous year : ' + JSON.stringify(error.error));
    });

  }

  onStartDateChange(event) {
    this.getDateDiff();
    this.getData();
    this.getAnalyticsProfileIds();
    this.getSerpList();
  }
  onEndDateChange(event) {
    this.getDateDiff();
    this.getData();
    this.getAnalyticsProfileIds();
    this.getSerpList();
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

    let res;
    if (previous == 0 && current != 0) {
      res = 100.00;
    } else if (previous != 0 && current == 0) {
      res = -100.00;
    } else if (current == 0 && previous == 0) {
      res = 0;
    } else {
      var diff = (current - previous) / previous * 100.0;
      res = diff;
    }
    return parseFloat(res.toString()).toFixed(2)
  }

  getData() {
    ;
    if (this.gscaccesstoken == '' || this.gscaccesstoken == undefined || this.gscaccesstoken == null) {
      //alert("Please, Login with Google to fetch data");
    } else if (parseDate(this.endDate) < parseDate(this.startDate)) {
      //alert("Start Date can not be grater then End Date");
    }
    else {
      ;
      let urlcamp = this.gscurl.replace('https://', '');
      urlcamp = urlcamp.replace('/', '');
      const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2F" + urlcamp + "/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";

      //const url = "https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fpatwa.co.in/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ"
      this.getDataCurrentYear(this.startDate, this.endDate, url);
      this.getDataCurrentYearWithDate(this.startDate, this.endDate, url);
      this.getDataByDevice(this.startDate, this.endDate, url)
    }
  }
  getDateSettings() {
    this.getDateDiff();
  }

  getPercentage(num, total) {
    return ((100 * num) / total)
  }

  // integrateGSC(): void {
  //   ;
  //   localStorage.setItem("selectedCompanyName", this.settingService.selectedCompanyInfo.companyId);
  //   localStorage.setItem("selectedCompanyRole", this.settingService.selectedCompanyInfo.role);
  //   localStorage.setItem("selectedCompanyImageUrl", this.settingService.selectedCompanyInfo.companyImageUrl);
  //   localStorage.setItem("isgsc", "1");
  //   let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters&access_type=offline&prompt=consent&include_granted_scopes=true&redirect_uri=' + environment.googleRedirectUrl + '&response_type=code&client_id=' + environment.googleClientId;
  //   window.location.href = connectYouTubeUrl;
  // }
  // integrateGoogleAnalytics(): void {
  //   ;
  //   localStorage.setItem("selectedCompanyName", this.settingService.selectedCompanyInfo.companyId);
  //   localStorage.setItem("selectedCompanyRole", this.settingService.selectedCompanyInfo.role);
  //   localStorage.setItem("selectedCompanyImageUrl", this.settingService.selectedCompanyInfo.companyImageUrl);
  //   localStorage.setItem("isga", "1");
  //   let connectYouTubeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics&access_type=offline&prompt=consent&include_granted_scopes=true&redirect_uri=' + environment.googleRedirectUrl + '&response_type=code&client_id=' + environment.googleClientId;
  //   window.location.href = connectYouTubeUrl;


  // }
  //#################  GSC data end ###########################################

  generatePdf() {
    const div = document.getElementById("pdfGenerate")!;
    const options = {
      margin: [15, 0, 15, 0],
      filename: 'report_builder.pdf',
      image: { type: 'jpeg', quality: 1 }, html2canvas: {
        dpi: 300,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'l' },
      // pagebreak: { before: '.page-break', avoid: 'table' }
    };

    html2pdf()
      .from(div)
      .set(options)
      .toPdf()
      .get('pdf').then(function (pdf) {
      })
      .save();
  }

  navigateToRoute() {
    this.router.navigate(['/home/campaign']);
  }

}
