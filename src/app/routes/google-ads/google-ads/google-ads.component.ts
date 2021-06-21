import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ColorsService } from 'src/app/shared/colors/colors.service';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';

@Component({
  selector: 'app-google-ads',
  templateUrl: './google-ads.component.html',
  styleUrls: ['./google-ads.component.scss']
})
export class GoogleAdsComponent implements OnInit {

  startDate;
  endDate;
  bsInlineRangeValue: Date[];
  bsValue = new Date();
  date = new Date();
  campaignList: Campaign[];
  selectedCampId: string;
  selectedCampaignName: string;
  settingActive;
  constructor(private translate: TranslateService, fb: FormBuilder,
    public route: ActivatedRoute, public http: HttpClient, public datepipe: DatePipe,
    public router: Router, private openIdConnectService: OpenIdConnectService,
    private campaignService: CampaignService, public colors: ColorsService) {

    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;

    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    this.getCampaignList();

  }

  ngOnInit(): void {
    this.flotChart1();
    this.flotChart2();
  }

  //Doughnut
  doughnutOptions = {
    responsive: true
  };

  doughnutColors = [{
    borderColor: 'white',
    backgroundColor: [
      "#1D88E5",
      "#3694E8",
      "#4BA0EA",
      "#62ACED",
      "#78B8EF",
      "#8FC4F2",
      "#A5CFF5",
      "#BCDBF6",
    ],
  }];
  doughnutData = {
    labels: [
      'Campaign-Biking',
      'Campaign-Fun',
      'Campaign-Jackets',
      'Campaign-T-Shirts',
      'Campaign-Dynamic Search Ads',
      'Campaign-Wearables',
      'Campaign-Active Wear',
      'Campaign-Accessories',
      'Campaign-Holiday'
    ],
    datasets: [{
      data: [26.1, 25.1, 12.3, 10.6, 10.3, 7.3, 7.3, 7.3]
    }]
  };

  //horizontalBar
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          fontSize: 18,
          fontStyle: 'bold'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          fontSize: 18,
          fontStyle: 'bold'
        }
      }]
    }
  };

  public barChartLabels: Label[] = ['Mobile Phone', 'Computer', 'Tablets'];
  public barChartType: string = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    {
      data: [0, 2, 4, 6, 8, 10, 12, 14, 16], label: 'Click',
      backgroundColor: "#1D88E5", hoverBackgroundColor: "#1D88E5"
    },

  ];

  //Flot chart
  barChartLabels1: Label[] = ['Aug18', 'Aug21', 'Aug24', 'Aug27', 'Aug30', 'Sep2', 'Sep5', 'Sep8', 'Sep11', 'Sep14'];

  barDataClicks = {
    labels: ['January'],
    'legend': {
      'onClick': function (evt, item) {

      },
    },
    datasets: [
      {
        data: [0, 100, 200, 300, 400], label: 'Conversion', legend: false, fill: false
      }, {
        data: [0, 2.5, 5, 7.5, 10], label: 'Conversion rate', legend: false, fill: false,
      }
    ]
  };
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

  barOptions = {

    scales: {
      yAxes: [{
        id: "left-y-axis",
        position: "left",
        ticks: {
          beginAtZero: true,
          stepSize: 100
        }
      }, {
        id: "right-y-axis",
        position: "right",
        ticks: {
          beginAtZero: true,
          stepSize: 1 + '%'
        }
      }]
    }
  };

  //Float chart
  public canvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public chartType: string = 'line';
  public chartData: any[];
  public chartLabels: any[];
  public chartColors: any[];
  public chartOptions: any;
  public chartType1: string = 'line';
  public chartData1: any[];
  public chartLabels1: any[];
  public chartColors1: any[];
  public chartOptions1: any;



  public flotChart1() {
    //properties for first graph
    this.chartData = [{
      data: [2000, 2500, 3000, 4000, 1000, 2000, 3000, 2900, 0, 4000],
      label: 'Clicks',
      fill: false
    }, {
      data: [2900, 0, 1000, 2000, 2500, 3000, 1500, 2000, 2354, 3500], label: 'CTR', fill: false,
    }];
    this.chartLabels = ['Aug 18', 'Aug 21', 'Aug 24', 'Aug 27', 'Aug 30', 'Sep 2', 'Sep 5', 'Sep 8', 'Sep 11', 'Sep 14'];
    this.chartColors = [{
      backgroundColor: 'orange',
      borderColor: 'orange'
    }, {
      backgroundColor: 'blue',
      borderColor: 'blue'
    }];
    this.chartOptions = {
      scales: {
        yAxes: [{
          id: "left-y-axis",
          position: "left",
          ticks: {
            beginAtZero: true,
            stepSize: 1000
          }
        }, {
          id: "right-y-axis",
          position: "right",
          ticks: {
            beginAtZero: true,
            stepSize: 1 + '%'
          }
        }]
      },
      annotation: {
        drawTime: 'beforeDatasetsDraw',
        annotations: [{
          type: 'box',
          id: 'a-box-1',
          yScaleID: 'y-axis-0',
          yMin: 0,
          yMax: 1,
          backgroundColor: '#4cf03b'
        }, {
          type: 'box',
          id: 'a-box-2',
          yScaleID: 'y-axis-0',
          yMin: 1,
          yMax: 2.7,
          backgroundColor: '#fefe32'
        }, {
          type: 'box',
          id: 'a-box-3',
          yScaleID: 'y-axis-0',
          yMin: 2.7,
          yMax: 5,
          backgroundColor: '#fe3232'
        }]
      }
    }
  }

  flotChart2() {
    //properties for second graph
    this.chartData1 = [{
      data: [100, 200, 500, 600, 600, 700, 1000, 0, 0, 1500],
      label: 'Cost',
      fill: false
    }, {
      data: [2000, 100, 245, 587, 0, 0, 1008, 1677, 100, 100], label: 'Avg. CPC', fill: false,
    }];
    this.chartLabels1 = ['Aug 18', 'Aug 21', 'Aug 24', 'Aug 27', 'Aug 30', 'Sep 2', 'Sep 5', 'Sep 8', 'Sep 11', 'Sep 14'];
    this.chartColors1 = [{
      backgroundColor: 'orange',
      borderColor: 'orange'
    }, {
      backgroundColor: 'blue',
      borderColor: 'blue'
    }];
    this.chartOptions1 = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 500
          }
        },
        {
          id: "right-y-axis1",
          position: "right",
          ticks: {
            beginAtZero: true,
            stepSize: 1 + '%'
          }
        }]
      },
      annotation: {
        drawTime: 'beforeDatasetsDraw',
        annotations: [{
          type: 'box',
          id: 'a-box-1',
          yScaleID: 'y-axis-0',
          yMin: 0,
          yMax: 1,
          backgroundColor: '#4cf03b'
        }, {
          type: 'box',
          id: 'a-box-2',
          yScaleID: 'y-axis-0',
          yMin: 1,
          yMax: 2.7,
          backgroundColor: '#fefe32'
        }, {
          type: 'box',
          id: 'a-box-3',
          yScaleID: 'y-axis-0',
          yMin: 2.7,
          yMax: 5,
          backgroundColor: '#fe3232'
        }]
      }
    }
  }



  //Datepicker
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

  // using to catch event to change report accroding to selected date range
  public onDateRangeSelect(event) {
    var StartDate = event[0].toISOString().split("T")[0];
    var endDate = event[1].toISOString().split("T")[0];
    this.startDate = StartDate;
    this.endDate = endDate
  }

  // using to get campaignList
  public getCampaignList(): void {

    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      var name = "";
      if (this.selectedCampId == ":id") {
        this.selectedCampId = this.campaignList[0].id
      }
      this.campaignList.map((s, i) => {
        if (s.id == this.selectedCampId) {
          name = s.name
        }
      })
      this.selectedCampaignName = name !== "" ? name : undefined;
    });
  }
  // using to get Campagins of selected campaign Id
  public onCampaignSelect(event, selectedCampaign) {
    this.selectedCampaignName = selectedCampaign.name
    this.selectedCampId = selectedCampaign.id
  }

}
