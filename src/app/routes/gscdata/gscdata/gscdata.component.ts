import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { parseDate } from 'ngx-bootstrap/chronos';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gscdata',
  templateUrl: './gscdata.component.html',
  styleUrls: ['./gscdata.component.scss']
})
export class GscdataComponent implements OnInit {
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
  //Chart variables
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
          return tooltipItems.yLabel

          //return tooltipItems.yLabel + '  Keywords'
        }
      }
    },
  };
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
  };
  barChartLabels: Label[] = [];
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
      pointHoverBackgroundColor: '#2D9EE2',
      pointHoverBorderColor: 'white'
    },];
  accessToken = '';
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  constructor(private authService: SocialAuthService, private http: HttpClient, public datepipe: DatePipe, public router: Router) {
    this.getDateSettings();
  }
  signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters'
    };
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
      .then((res) => {
        this.accessToken = res['authToken'];
        this.getData();

      })
  }

  getDataCurrentYear(startDate, endDate, all) {
    
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.abhisi.com%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
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
          this.cTRThisYear =  parseFloat(rows[0].ctr).toFixed(2).toString();
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
    
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.abhisi.com%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
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
          this.impressionsPreviousYear =  rows[0].impressions;
          this.cTRPreviousYear = parseFloat(rows[0].ctr).toFixed(2).toString();
          this.positionPreviousYear  = parseFloat(rows[0].position).toFixed(2).toString();

          //pecentgage calculate
          //(previous-current*100)/Previous
          
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
  ngOnInit() {

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
    }
  }
  getDateSettings() {
    
    this.startDate = this.datepipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.currYear = parseInt(this.datepipe.transform(this.fromDate.value, 'yyyy'));
    let prevYear = this.currYear - 1;
    this.previousStartDate = prevYear.toString() + '-' + this.datepipe.transform(this.fromDate.value, 'MM-dd');
    this.endDate = this.datepipe.transform(this.toDate.value, 'yyyy-MM-dd');
    this.currYear = parseInt(this.datepipe.transform(this.toDate.value, 'yyyy'));
    prevYear = this.currYear - 1;
    this.previousEndDate = prevYear.toString() + '-' + this.datepipe.transform(this.toDate.value, 'MM-dd');
  }
  public goToLinkedIn(event) {

    this.router.navigate([`/linkedin`])
  }
  public goToInstagram(event) {

    this.router.navigate([`/instagram`])
  }
  public goToGSC(event) {

    this.router.navigate([`/gsc`])
  }
  getPercentage(num, total) {
    return ((100 * num) / total)
  }
}
