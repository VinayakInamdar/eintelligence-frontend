import { Component, OnInit, Directive, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { LocalDataSource } from 'ng2-smart-table';
import { ChartDataSets, ChartOptions, ChartScales } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { IntegrationsService } from '../../integrations/integrations.service';
import { OverviewService } from '../../overview/overview.service';
import { PlatformLocation } from '@angular/common';


const success = require('sweetalert');

@Component({
  selector: 'app-campagin',
  templateUrl: './campagin.component.html',
  styleUrls: ['./campagin.component.scss']
})
@Directive({ selector: '[ng2FileSelect]' })

export class CampaginComponent implements OnInit,AfterViewInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild(BaseChartDirective)
    public chart: BaseChartDirective;
  valForm: FormGroup;
  public campaignModel: Campaign;
  edit: boolean;
  public value: any = {};

  sub: Subscription;
  id: number;
  public demo1TabIndex = 0;
  public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  url: string;
  gaAccounts: any;
  hasGaSetup: boolean;
  googleAnalyticsAccountSetupList: GoogleAnalyticsAccountSetups[];
  activeAccount: any;
  hasActiveAccount: boolean = false;
  authorizeGaAccounts: any;
  hasAuthorize: boolean;
  reportsData:any;
  selectedCampaignName:string;
  selectedCampId : string;
  campaignList: import("c:/Users/rahik/CoreFrontend_Techovarya(2)/eintelligence-frontend/src/app/routes/campaign/campaign.model").Campaign[];
  settings = {
    actions:{add: false, edit:false, delete:false},
    columns: {
      name: {
        title: 'name',
        filter: false
      },
      webUrl: {
        title: 'webUrl',
        filter: false
      },
      moreTraffic: {
        title: 'moreTraffic',
        filter: false
      },
      sales: {
        title: 'sales',
        filter: false
      },
      leadGeneration: {
        title: 'leadGeneration',
        filter: false
      }
    }
  };
  source: LocalDataSource;
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

  lineChartLabels: Label[] = [];

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
  showdiv: boolean = false;
  show: string = 'undefine';
  bsInlineRangeValue: Date[];
  settingActive : number = 2;


  constructor(private translate: TranslateService,  fb: FormBuilder,
    private campaignService: CampaignService, 
     public route: ActivatedRoute, public router: Router,private integrationsService : IntegrationsService
     ,private overvieswService : OverviewService,location: PlatformLocation) { 

      this.campaignModel = new Campaign();
      this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
      // this.getGaSetupByCampaignId();
      this.getCampaignList();
      location.onPopState(() => {

        // console.log('pressed back!');

    });
      

      this.valForm = fb.group({
        'name': [this.campaignModel.name, Validators.required],
        'webUrl': [this.campaignModel.webUrl,[Validators.required,Validators.pattern(this.myreg)]],
        'moreTraffic': [this.campaignModel.moreTraffic, Validators.required],   
        'sales': [this.campaignModel.sales, Validators.required],
        'leadGeneration': [this.campaignModel.leadGeneration, Validators.required],         
    })     
  }


  ngAfterViewInit(): void {
    this.url = this.router.url
    if(this.url.includes('/home/campaign')) {
       this.settingActive = 1;
    }
    // using to disable tab , user have to go step by step 
    this.disableTab()
  }

     
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
  });
  }
  
  // using to check Integration Status of selected campaign Id
  goToOverview(): void{
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    this.router.navigate(['/integrations', this.selectedCampId]);
  }

 // using to get analytics data of selected campaign Id
  getAnalyticsData(): void{

    this.overvieswService.getGaAnalyticsReports(this.selectedCampId,this.startDate,this.endDate).subscribe(
      res =>{
          this.reportsData = res;
          // console.log(this.reportsData)
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
      var date = new Date(finalstring)
      var date2 = date.toLocaleDateString("en-US", {month: 'long',day: 'numeric' })
      var arraydate = date2.split(' ')
      var odate = arraydate[1];
      var omon = arraydate[0];
      var finaldate = odate + " " + omon
      LineChartsdate.push(finaldate)
     })
     this.lineChartLabels = LineChartsdate

  }

  // using to get google analytics setup of selected campaign Id
  public getGaSetupByCampaignId(): void{
     
    this.integrationsService.getGaSetupByCampaignId(this.selectedCampId).subscribe(
    
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

  // using to get list of campaigns
  public getCampaignList(): void {
    this.campaignService.getCampaign().subscribe(res => {
        this.campaignList = res; 
        this.source = new LocalDataSource(this.campaignList)            
    });
}

// using to navigate to overview page to view anlytics of selected campaign
public onCampaignSelect(event,selectedCampaign) {
  this.selectedCampaignName = selectedCampaign.name
  this.selectedCampId = selectedCampaign.id
  this.router.navigate(['/campaign', {id : this.selectedCampId}]);
  this.settingActive = 3
  this.getGaSetupByCampaignId();
  this.getAnalyticsData();
}

// using to search campaign locally
onSearch(query: string = '') {
  if(query == "") {
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
  goToNextTab(event,inputvalue,fieldName,tabid) {
    event.preventDefault()
    var value = this.validateForm(fieldName)
    
    if(value =='VALID') {
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
  goToPreviousTab(event,tabid){
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
userRowSelect(campaign: any) : void{

  this.selectedCampaignName = campaign.data.name
  this.selectedCampId = campaign.data.id
  this.router.navigate(['/campaign', {id : campaign.data.id}]);
  this.settingActive = 3
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
   this.settingActive = 1
   this.disableTab()
}

//using to open div on mouseover event
public showDiv(event,value,show) {
 this.showdiv = value == 'true' ? true : false;
 this.show = show;

}

//using to view keyword list and also add new keyword
goToKeywords(): void {
  this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`])
}

}
