import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Campaign } from '../../campaign/campaign.model';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { LocalDataSource } from 'ng2-smart-table';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { CampaignService } from '../../campaign/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from '../../overview/overview.service';
import { AuditsService } from '../../audits/audits.service';
import { PlatformLocation } from '@angular/common';
import { IntegrationsService } from '../../integrations/integrations.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import * as Chart from 'chart.js';

const success = require('sweetalert');
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;
  @ViewChild('dougnutChart')
  public dougnutchart: BaseChartDirective;
  @ViewChild('dougnutChart1') dougnutChart1: ElementRef;
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
      'Direct',
      'Display',
      'Organic',
      'Referral',
      'Social',
    ],
    datasets: []
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
    cutoutPercentage: 80,
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        const index = this.chart.data.labels.indexOf(legendItem.text);
        const rect = this.chart.canvas.getBoundingClientRect();
        const point = this.chart.getDatasetMeta(0).data[index].getCenterPoint();
        const e = new MouseEvent('mousemove', {
          clientX: rect.left + point.x,
          clientY: rect.top + point.y
        });
        this.chart.canvas.dispatchEvent(e);
      },
    },
  };
  doughnutData1 = {
    labels: [
      'Desktop',
      'Mobile',
      'Tablet',
    ],
    datasets: []
  };

  doughnutColors1 = [{
    borderColor: 'white',
    backgroundColor: [
      "#0000D6",
      "#36A1F7",
      "#8CC8FA",
    ],
    hoverBackgroundColor: [
      "#0000D6",
      "#36A1F7",
      "#8CC8FA",
    ],
  }];

  doughnutOptions1 = {
    responsive: true,
    cutoutPercentage: 80,
    legend: {
      position: 'bottom',
      onHover: function (event, legendItem) {
        const index = this.chart.data.labels.indexOf(legendItem.text);
        const rect = this.chart.canvas.getBoundingClientRect();
        const point = this.chart.getDatasetMeta(0).data[index].getCenterPoint();
        const e = new MouseEvent('mousemove', {
          clientX: rect.left + point.x,
          clientY: rect.top + point.y
        });
        this.chart.canvas.dispatchEvent(e);
      },
      onLeave: function (evt, legendItem) {
        const index = this.chart.data.labels.indexOf(legendItem.text);
        const activeSegment = this.chart.getDatasetMeta(0).data[index];
        activeSegment._model.backgroundColor = activeSegment._view.backgroundColor;
        activeSegment._model.borderWidth = activeSegment._view.borderWidth;
        this.chart.tooltip._active = [];
        this.chart.tooltip.update();
        this.chart.draw();
      }

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
  selectedCampaignName: string;
  selectedCampId: string;
  campaignList: Campaign[];
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
      moreTraffic: {
        title: 'MORETRAFFIC',
        filter: false
      },
      sales: {
        title: 'SALES',
        filter: false
      },
      leadGeneration: {
        title: 'LEADGENERATION',
        filter: false
      }
    }
  };
  source: LocalDataSource;
  bsValue = new Date();
  date = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split("T")[0]; queryParams: any;
  setCurrentSettingActive: number;
  selectedCampIdWebUrl: string;
  selectedCampaignTaskId: string;
  securitySection: { ssl: any; sslcertificate: any; have_sitemap: any; have_robots: any; };
  chart1: Chart;
  top5geoLocationsData: any;
  top5landingPagesData: any;
  top5languagesData: any;
  showDefault: string;
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
    { data: [], label: 'Sessions', borderCapStyle: 'square', fill: true, lineTension: 0 },
  ];

  lineChartLabels: Label[] = [];

  //lineChartLabels: Label[] = this.dateLabels;

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
      backgroundColor: '#2D9EE2',
      pointBorderColor: '#2D9EE2',
      pointBackgroundColor: 'white'
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [], label: '#1-#3', legend: false
      }, {
        data: [], label: '#4-#10',
      }, {
        data: [], label: '#11-#20',
      }, {
        data: [], label: '#21-#50',
      },
      {
        data: [], label: '#51-#100',
      },
      {
        data: [], label: '#100+',
      }]
  };

  barColors = [
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
      labels: {
        fontColor: 'rgb(255, 99, 132)'
      },
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
  };


  showdiv: boolean = false;
  show: string = 'undefine';
  bsInlineRangeValue: Date[];
  acqusitionsubmenu: boolean = false;
  audiencesubmenu: boolean = false;
  behaviorsubmenu: boolean = false;
  conversionsubmenu: boolean = false;
  settingActive: number = 3;


  constructor(private translate: TranslateService, fb: FormBuilder,
    private campaignService: CampaignService,
    public route: ActivatedRoute, public router: Router, private integrationsService: IntegrationsService
    , private overvieswService: OverviewService, location: PlatformLocation,
    public auditsService: AuditsService) {

    this.campaignModel = new Campaign();
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    // this.getGaSetupByCampaignId();
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    this.getGaSetupByCampaignId();
    this.getAnalyticsData();
    this.getCampaignList();
    this.getSerpList();
    this.showdiv = true;
    this.show = 'analytics'
    this.showDefault = 'analytics'
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
        this.campaignService.GetDeviceCategoryReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
          devicecategoryres => {
            this.campaignService.GetTrafficSourcesReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
              trafficsourcers => {
                this.campaignService.GetGeoLocationReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
                  geolocationres => {
                    this.campaignService.GetLanguageReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
                      languageres => {
                        this.campaignService.GetGaBehaviorAnalyticsReports(this.selectedCampId, this.startDate, this.endDate).subscribe(
                          behaviorres => {
                            this.top5geoLocationsData = geolocationres['geoLocation'].sort((a, b) => {
                              return +b.sessions - +a.sessions
                            }).slice(0, 5)
                            this.top5landingPagesData = behaviorres['landingPages'].sort((a, b) => {
                              return +b.pageviews - +a.pageviews
                            }).slice(0, 5)
                            this.top5languagesData = languageres['language'].sort((a, b) => {
                              return +b.users - +a.users
                            }).slice(0, 5)
                            if (this.doughnutData1.datasets.length == 0) {
                              var data = [parseInt(devicecategoryres['desktop']['sessions']), parseInt(devicecategoryres['mobile']['sessions']), parseInt(devicecategoryres['tablet']['sessions'])]
                              this.doughnutData1.datasets.push({ data: data, backgroundColor: ["#1c73a4", "#36A1F7", "#8CC8FA"], borderColor: ['rgb(28, 115, 164)', 'rgba(54, 161, 247)', 'rgba(140, 200, 250)'], hoverBackgroundColor: ['rgb(28, 115, 164)', 'rgba(54, 161, 247, 3)', 'rgba(140, 200, 250, 3)'], borderWidth: 1, hoverBorderColor: ['rgba(28, 115, 164,1)', 'rgba(54, 161, 247, 3)', 'rgba(140, 200, 250, 3)'], hoverBorderWidth: 3 })
                            }
                            if (this.doughnutData.datasets.length == 0) {
                              var data = [parseInt(trafficsourcers['totalData']['direct']['pageviews']), parseInt(trafficsourcers['totalData']['display']['pageviews']), parseInt(trafficsourcers['totalData']['organic']['pageviews']), parseInt(trafficsourcers['totalData']['referral']['pageviews']), parseInt(trafficsourcers['totalData']['social']['pageviews'])]
                              this.doughnutData.datasets.push({ data: data, backgroundColor: ["#1c73a4", "#36A1F7", "#8CC8FA", "#E2F1FD", "#FF723D"], borderColor: ['rgb(28, 115, 164)', 'rgba(54, 161, 247)', 'rgba(140, 200, 250)', 'rgba(226, 241, 253)', 'rgba(255, 114, 61)'], hoverBackgroundColor: ['rgb(28, 115, 164)', 'rgba(54, 161, 247, 3)', 'rgba(140, 200, 250, 3)', 'rgba(226, 241, 253, 1)', 'rgba(255, 114, 61, 1)'], borderWidth: 1, hoverBorderColor: ['rgba(28, 115, 164,1)', 'rgba(54, 161, 247, 3)', 'rgba(140, 200, 250, 3)', 'rgba(226, 241, 253, 1)', 'rgba(255, 114, 61, 1)'], hoverBorderWidth: 3 })
                            }
                            this.reportsData = res;
                            this.dateLabels = this.reportsData.gaPreparedDataDto.date;
                            this.convertToLineChartsLabels(this.reportsData.gaPreparedDataDto.date)
                            this.convertToLineChartsData(this.reportsData.gaPreparedDataDto.sessions)
                            this.showSpinnerBaseChart = false;
                            this.showSpinnerSiteAnalysisContent = false;
                          })
                      })
                  })


              })


          })

      }
    );


  }

  //using to show charts data according to selected value in both dropdown
  convertToLineChartsData(sessions: any) {
    if (this.lineChartData.length > 1) {
      this.lineChartData[0].data = this.reportsData.gaPreparedDataDto[this.selectedLabelValue]
      this.lineChartData[1].data = this.reportsData.gaPreparedDataDto['percentNewSessions']
      this.lineChartData[2].data = this.reportsData.gaPreparedDataDto['bounceRate']
      this.lineChartData[3].data = this.reportsData.gaPreparedDataDto['pageviewsPerSession']
      this.lineChartData[4].data = this.reportsData.gaPreparedDataDto['pageviews']

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

  // using to get list of campaigns
  public getCampaignList(): void {
    this.campaignService.getCampaign().subscribe(res => {
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
      this.getSelectedCampaignWebsiteAuditReportData()
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

      var taskId = selectedCampTaskId[0].taskId
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

      })

    })
  }
  // using to get list of keyword list
  public getSerpList(): void {
    this.campaignService.getSerp().subscribe(res => {
      // this.serpList = res; 
      // this.source = new LocalDataSource(this.serpList) 
      var serpData = res.map((s, i) => {
        if (s.position > 0 && s.position <= 3) {
          this.barData.datasets[0].data.push(s.position)
        }
        else if (s.position > 3 && s.position <= 10) {
          this.barData.datasets[1].data = s.position
        }
        else if (s.position > 10 && s.position <= 20) {
          this.barData.datasets[2].data = s.position
        }
        else if (s.position > 20 && s.position <= 50) {
          this.barData.datasets[3].data = s.position
        }
        else if (s.position > 50 && s.position <= 100) {
          this.barData.datasets[4].data = s.position
        }
        else if (s.position > 100) {
          this.barData.datasets[5].data = s.position
        }

      })
      this.chart.chart.update();
    });
  }

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

}
