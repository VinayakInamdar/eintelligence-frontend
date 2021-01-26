import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-gscdata',
  templateUrl: './gscdata.component.html',
  styleUrls: ['./gscdata.component.scss']
})
export class GscdataComponent implements OnInit {
  clicksData = [];
  dateListData = [];
  impressionData;
  currDate:string;
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
          return tooltipItems.yLabel + '  Keywords'
        }
      }
    },
  };
  barData = {
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

  constructor(private authService: SocialAuthService, private http: HttpClient) {
    // this.barData.datasets[0].data = [10, 20, 34, 6, 43, 12, 56, 86, 5, 33, 24, 55];
    // this.barData.datasets[1].data = [13, 10, 84, 77, 3, 12, 57, 54, 65, 34, 33, 22];
    this.barDataImpressions.datasets[0].data = [1, 2, 3, 6, 43, 2, 56, 86, 5, 3, 24, 55];
    this.barDataImpressions.datasets[1].data = [13, 10, 4.77, 3, 12, 57, 4, 65, 4, 3, 22];
  }

  signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters'
    }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
      .then((res) => {
        console.log('Logged in', res);
        this.accessToken = res['authToken'];
        let idToken = res['idToken'];
        this.getData();
      })
    //.then(x => console.log(x));
  }
  getSiteData() {
    debugger
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    //const url = "https://https://www.googleapis.com/auth/compute/www.abhisi.com/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    const url = "https://searchconsole.googleapis.com/webmasters/v3/sites?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        debugger
        alert(res);
      }
    }, error => {
      debugger
      alert('Checkout Failed For Subscription: ' + JSON.stringify(error.error));
    });

  }
  getData(startDate, endDate) {
    debugger
    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.abhisi.com%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
    let data = {
      "startRow": 0,
      "startDate": "2021-01-15",
      "endDate": "2021-01-25",
      "dataState": "ALL",
      "dimensions": [
        "DATE"
      ]
    };
    this.http.post(url, data, this.httpOptionJSON).subscribe(res => {
      if (res) {
        debugger
        let rows = res['rows'];
        this.dateListData = [];
        this.barData.datasets[0].data=[];
        this.barData.datasets[1].data=[];
        this.barChartLabels=[];
        for (let i = 0; i < rows.length; i++) {
          this.currDate = rows[i].keys[0]
          this.currDate = this.currDate.substring(5,10);
           this.dateListData.push(this.currDate);
          // this.dateListData.push(this.datepipe.transform(rows[i].keys[0], 'MMM d'));
          this.barData.datasets[0].data.push(rows[i].clicks);
          this.barData.datasets[1].data.push(rows[i].clicks + 10);
          this.barChartLabels.push(this.currDate);
        }
       // this.barData.datasets[0].data = [10, 20, 34, 6, 43, 12, 56, 86, 5, 33, 24, 55];
      }
    }, error => {
      debugger
      alert('Checkout Failed For Subscription: ' + JSON.stringify(error.error));
    });

  }
  ngOnInit() {

  }

}
