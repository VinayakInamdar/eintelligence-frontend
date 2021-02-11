import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { FilterOptionModel } from '../../shared/model/filter-option.model';
import { parseDate } from 'ngx-bootstrap/chronos';
import { CampaignService } from '../campaign/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})

export class HomeGscService {

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
  campaignList = [];
  selectedCampIdWebUrl: string;
  selectedCampId: string;
  selectedCampaignName: string;
  
  accessToken = localStorage.getItem('googleGscAccessToken');
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  constructor(  private http: HttpClient, public datepipe: DatePipe, public router: Router,
    private campaignService: CampaignService, public openIdConnectService: OpenIdConnectService, public route: ActivatedRoute) {
    
      let id = localStorage.getItem('selectedCampId');
    this.accessToken = localStorage.getItem('googleGscAccessToken');
    this.selectedCampId = `${id}`;
    this.getDateSettings();
  

  }
 
 
  getDataByDevice(startDate, endDate) {

    this.httpOptionJSON = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken,
      })
    };
    const url = "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.abhisi.com%2F/searchAnalytics/query?key=AIzaSyC1IsrCeeNXp9ksAmC8szBtYVjTLJC9UWQ";
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
          this.cTRThisYear = parseFloat(rows[0].ctr).toFixed(2).toString();
          this.positionThisYear = parseFloat(rows[0].position).toFixed(2).toString();
        }
        else {
          this.dateListData = [];
          for (let i = 0; i < rows.length; i++) {
            this.currDate = rows[i].keys[0]
            this.currDate = this.currDate.substring(5, 10);
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
          this.impressionsPreviousYear = rows[0].impressions;
          this.cTRPreviousYear = parseFloat(rows[0].ctr).toFixed(2).toString();
          this.positionPreviousYear = parseFloat(rows[0].position).toFixed(2).toString();

          //pecentgage calculate
          debugger
          this.percentClicks = this.getYearwiseDifference(this.clicksPreviousYear, this.clicksThisYear);
          localStorage.setItem("percentClicks",this.percentClicks);
          this.percentImpressions = this.getYearwiseDifference(this.impressionsPreviousYear, this.impressionsThisYear);
          this.percentPosition = this.getYearwiseDifference(this.positionPreviousYear, this.positionThisYear);
          this.percentCTR = this.getYearwiseDifference(this.cTRPreviousYear, this.cTRThisYear);
        }
        else {
          this.dateListData = [];
          for (let i = 0; i < rows.length; i++) {
            this.currDate = rows[i].keys[0]
            this.currDate = this.currDate.substring(5, 10);
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

this.accessToken = localStorage.getItem('googleGscAccessToken');
    if (this.accessToken == '' || this.accessToken == undefined || this.accessToken == null) {
      alert("Please, Login with Google to fetch data");
    } else if (parseDate(this.endDate) < parseDate(this.startDate)) {
      alert("Start Date can not be grater then End Date");
    }
    else {
      debugger
      this.getDataCurrentYear(this.startDate, this.endDate, 0);
      this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, 0);
      this.getDataCurrentYear(this.startDate, this.endDate, 1);
      this.getDataPreviousYear(this.previousStartDate, this.previousEndDate, 1);
      this.getDataByDevice(this.startDate, this.endDate)

    }
  }
  getDateSettings() {
    let currDate = new Date();
      this.endDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.startDate = this.datepipe.transform(currDate.setMonth(currDate.getMonth() - 1), 'yyyy-MM-dd');
      this.previousEndDate = this.datepipe.transform(currDate, 'yyyy-MM-dd');
      this.previousStartDate = this.datepipe.transform(currDate.setMonth(currDate.getMonth() - 1), 'yyyy-MM-dd');
  }

  getYearwiseDifference(previous, current) {
    
    let diff = ((parseFloat(previous) - parseFloat(current)) * 100) / parseFloat(previous)
    return parseFloat(diff.toString()).toFixed(2)

  }
  getPercentage(num, total) {
    return ((100 * num) / total)
  }
}