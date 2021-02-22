import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
