import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { IntegrationsService } from '../../integrations/integrations.service';
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { GoogleAccountSetups } from '../../integrations/googleAccountSetups.model';
import { OverviewService } from '../overview.service';
import { ChartDataSets, ChartOptions, ChartScales } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { CampaignService } from '../../campaign/campaign.service';
import { Campaign } from '../../campaign/campaign.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @ViewChild(BaseChartDirective)
    public chart: BaseChartDirective;

  campaignName : String;
  selectedCampId : string;
  gaAccounts: any;
  hasGaSetup: boolean;
  googleAnalyticsAccountSetupList: GoogleAnalyticsAccountSetups[];
  activeAccount: any;
  hasActiveAccount: boolean = false;
  authorizeGaAccounts: any;
  hasAuthorize: boolean;
  reportsData:any;
  selectedCampaignName:string;
  bsValue = new Date();
  date = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split("T")[0];;
  endDate = new Date().toISOString().split("T")[0];;
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  ranges = [{
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
    label: 'Last 7 Days'
  },{
    value: [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()],
    label: 'Last 30 Days'
  }, {
    value: [new Date(this.date.getFullYear(), this.date.getMonth()-1, 1), new Date(this.date.getFullYear(), this.date.getMonth() - 1, 31)],
    label: 'Last Month'
  },{
    value: [new Date(this.date.getFullYear(), this.date.getMonth(), 1), new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)],
    label: 'This Month'
  },
  {
    value: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))],
    label: 'Next 7 Days'
  }];
  dateLabels: any;
  selectedLabel:number = 0;
  selctedLabelName:string = 'Sessions';
  selectedLabelValue:string = 'sessions'
  selectedLabel1: number;
  selctedLabelName1:string = 'Select Matrix';
  selectedLabelValue1:string;
  dropdownlabels: any = [
    {id:0,label:'Sessions',value:'sessions'},
    {id:1,label:'Users',value:'users'},
    {id:2,label:'New Sessions',value:'percentNewSessions'},
    {id:3,label:'Bouncerate',value:'bounceRate'},
    {id:4,label:'Pageviews',value:'pageviews'},
    {id:5,label:'Pages/Sessions',value:'pageviewsPerSession'},
    {id:6,label:'Avg Sess. Duration',value:'avgSessionDuration'},
    {id:7,label:'Goal Completio',value:'goalCompletionsAll'},
    {id:8,label:'Conversation Rate',value:'goalConversionRateAll'}
  ]
  dropdownlabels1: any = [
    {id:0,label:'Sessions',value:'sessions'},
    {id:1,label:'Users',value:'users'},
    {id:2,label:'New Sessions',value:'percentNewSessions'},
    {id:3,label:'Bouncerate',value:'bounceRate'},
    {id:4,label:'Pageviews',value:'pageviews'},
    {id:5,label:'Pages/Sessions',value:'pageviewsPerSession'},
    {id:6,label:'Avg Sess. Duration',value:'avgSessionDuration'},
    {id:7,label:'Goal Completio',value:'goalCompletionsAll'},
    {id:8,label:'Conversation Rate',value:'goalConversionRateAll'}
  ]
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Sessions', borderCapStyle: 'square' },
  ];

  lineChartLabels: Label[] = ['1 jan',  '3jan',  '5jan', '7jan','8 jan', '9 jan', '11 jan', '13 jan', '15 jan', '17 jan','19 jan','21 jan', '23 jan', '27 jan', '29 jan'];

  //lineChartLabels: Label[] = this.dateLabels;

  lineChartOptions : ChartOptions  = {
    responsive: true,
    maintainAspectRatio: false,
    scales :{
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
      backgroundColor:  'rgba(12, 162, 235, 0.2)',
      pointBorderColor : '#2D9EE2',
      pointBackgroundColor :'white'
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



  constructor(private route : ActivatedRoute, private router: Router, private integrationsService : IntegrationsService,
     private overvieswService : OverviewService,public campaignService: CampaignService,
     private location: Location ) {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    this.url = this.router.url
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    this.getGaSetupByCampaignId();
    this.getCampaignList();
  }

  ngOnInit(): void {

    let name = this.route.snapshot.paramMap.get('name');
    this.campaignName = ` ${name}`;

    this.getAnalyticsData();
  }
    // using to check Integration Status of selected campaign Id
  goToOverview(): void{
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    // this.router.navigate(['/integrations',{id : id}]);

    this.router.navigate(['/integrations', this.selectedCampId]);
  }

 //using to view keyword list and also add new keyword
  goToKeywords(): void {
    // this.router.navigate(['/keywords'])
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`,])
  }
   // using to get analytics data of selected campaign Id
  getAnalyticsData(): void{

    this.overvieswService.getGaAnalyticsReports(this.selectedCampId,this.startDate,this.endDate).subscribe(
      res =>{
          this.reportsData = res;
           this.dateLabels = this.reportsData.gaPreparedDataDto.date;
           
           this.convertToLineChartsLabels(this.reportsData.gaPreparedDataDto.date)
           this.convertToLineChartsData(this.reportsData.gaPreparedDataDto.sessions)
           
      }
    );


  }

    //using to show charts data according to selected value in both dropdown
  convertToLineChartsData(sessions: any) {
    if(this.lineChartData.length > 1) {
  
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
    reportDates.map((s,i)=>{
      var one = s.substring(0,s.length - 4 );
      var two = s.substring( s.length -4, s.length - 2);
      var three = s.substring( s.length - 2 );
      var finalstring = one + '/' + two + '/' + three 
      // console.log(one,two,three,finalstring)
      var date = new Date(finalstring)
      var date2 = date.toLocaleDateString("en-US", {month: 'long',day: 'numeric' })
      // console.log(date)
      var arraydate = date2.split(' ')
      var odate = arraydate[1];
      var omon = arraydate[0];
      var finaldate = odate + " " + omon
      LineChartsdate.push(finaldate)
     })
    //  console.log(LineChartsdate)
     this.lineChartLabels = LineChartsdate

  }

    // using to get google analytics setup of selected campaign Id
  public getGaSetupByCampaignId(): void{

  //   let id = this.route.snapshot.paramMap.get('id');
  // this.selectedCampId = `${id}`;
     
    this.integrationsService.getGaSetupByCampaignId(this.selectedCampId).subscribe(
    
      // this.states = this.selectService.getStates().filter((item) => item.countryid == countryid);

      res => {
        this.googleAnalyticsAccountSetupList = res;
        // console.log(res)
        if(this.googleAnalyticsAccountSetupList && this.googleAnalyticsAccountSetupList.length > 0 ){


          this.gaAccounts =  this.googleAnalyticsAccountSetupList.map(function (item) { return  item.googleAccountSetups; });

          this.authorizeGaAccounts =  this.gaAccounts.filter(function (item) { return  item.isAuthorize == true });

          this.activeAccount = this.googleAnalyticsAccountSetupList.map(function (item) {
            if(item.active == true){
              return item.googleAccountSetups;
            }
          })[0];

          if(this.activeAccount){
            this.hasActiveAccount = true;
          }

          if(this.authorizeGaAccounts.length > 0){
            this.hasAuthorize =true
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
    this.campaignService.getCampaign().subscribe(res => {
        this.campaignList = res;
        var name = "";
        this.campaignList.map((s,i)=>{
          if(s.id == this.selectedCampId){
            name = s.name
          }
        })
        this.selectedCampaignName = name;
    });
}
 
// using to navigate to overview page to view anlytics of selected campaign
 public onCampaignSelect(event,selectedCampaign) {
   this.selectedCampaignName = selectedCampaign.name
   this.selectedCampId = selectedCampaign.id
   if(this.url.includes('/campaign')){
    this.router.navigate(['/campaign/overview', {id : this.selectedCampId}]);
   }
   else {
    this.router.navigate(['/home/overview', {id : this.selectedCampId}]);
   }

   this.getGaSetupByCampaignId();
   this.getAnalyticsData();
 }

 // using to change properties with changing 1st dropdown value
 public onLabelSelect(event,selectedLabel) {
   this.selectedLabel = selectedLabel.id
   this.selctedLabelName = selectedLabel.label
   this.selectedLabelValue = selectedLabel.value
   this.lineChartData[0].label = selectedLabel.label
   this.updateChart(selectedLabel)
 }

 // using to change properties with changing select matrix dropdown value
 public onLabelSelect1(event,selectedLabel) {
  this.selectedLabel1 = selectedLabel.id
  this.selctedLabelName1 = selectedLabel.label
  this.selectedLabelValue1 = selectedLabel.value
  this.updateChart1(selectedLabel)
}

 //using to update chart with changing 1st dropdown value
  updateChart(selectedLabel) {
     var dataforselectedLabel = []
    dataforselectedLabel =  this.reportsData.gaPreparedDataDto[selectedLabel.value]
     this.lineChartData[0].data = dataforselectedLabel
     this.chart.chart.update();
  }

   // using to update chart with changing select matrix dropdown value
  updateChart1(selectedLabel) {
    var dataforselectedLabel = []
   dataforselectedLabel =  this.reportsData.gaPreparedDataDto[selectedLabel.value]
    if(this.lineChartData.length > 1 ){
      this.lineChartData.splice(1,1,{ backgroundColor: "rgba(255,255,0,0.3)",borderColor: "#f5994e",data: dataforselectedLabel, label: selectedLabel.label, borderCapStyle: 'square',pointBackgroundColor: "white",pointBorderColor: "#2D9EE2" })
    }
    else {
      this.lineChartData.splice(1,0,{ backgroundColor: "rgba(255,255,0,0.3)",borderColor: "#f5994e",data: dataforselectedLabel, label: selectedLabel.label, borderCapStyle: 'square',pointBackgroundColor: "white",pointBorderColor: "#2D9EE2" })
    }
    this.chart.chart.update();
 }

 // using to catch event to change report accroding to selected date range
 public onDateRangeSelect(event){
   var StartDate = event[0].toISOString().split("T")[0];
   var endDate = event[1].toISOString().split("T")[0];
   this.startDate = StartDate;
   this.endDate = endDate
   this.getAnalyticsData();
 }

// using to open create campaign view to add new campaign in db
 public onClick(event): any {
  this.router.navigate(['/home/campagin']);
}

//using to open div on mouseover event
public showDiv(event,value,show) {
  this.showdiv = value == 'true' ? true : false;
  this.show = show;

}



}
