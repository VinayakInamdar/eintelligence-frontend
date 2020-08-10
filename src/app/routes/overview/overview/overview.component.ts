import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IntegrationsService } from '../../integrations/integrations.service';
import { GoogleAnalyticsAccountSetups } from '../../integrations/googleAnalyticsAccount.model';
import { GoogleAccountSetups } from '../../integrations/googleAccountSetups.model';
import { OverviewService } from '../overview.service';
import { ChartDataSets, ChartOptions, ChartScales } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  
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


  
  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 30, 75, 77 ,25, 72, 48, 55, 17 ,85, 52, 58, 75, 27 ,35, 82, 48, 35, 47 ,75, 12, 48, 75, 67 ,65, 12, 28, 45, 77 ,85, 72, 28, 75, 77 ,25, 32, 48, 85, 17,74 ], label: 'Sessions', borderCapStyle: 'square' },
  ];

  lineChartLabels: Label[] = ['1 jan', '2 jan', '3jan', '4jan', '5jan', '6jan','1 jan', '2 jan', '3jan', '4jan', '5jan','6jan','1 jan', '2 jan', '3jan', '4jan', '5jan','6jan','1 jan', '2 jan', '3jan', '4jan', '5jan','6jan','1 jan', '2 jan', '3jan', '4jan', '5jan','6jan','1 jan', '2 jan', '3jan', '4jan', '5jan','6jan','1 jan', '2 jan', '3jan', '4jan', '5jan' ];

  lineChartOptions : ChartOptions  = {
    responsive: true,
    maintainAspectRatio: false,
    scales :{
      xAxes: [{
        gridLines: {
           display: false
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
      backgroundColor:  'rgba(54, 162, 235, 0.2)',
      pointBorderColor : '#2D9EE2',
      pointBackgroundColor :'white'   
    },
  ];

  

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  
  constructor(private route : ActivatedRoute, private router: Router, private integrationsService : IntegrationsService, private overvieswService : OverviewService ) { 

    this.getGaSetupByCampaignId();
  }

  ngOnInit(): void {

    let name = this.route.snapshot.paramMap.get('name');
    this.campaignName = ` ${name}`;

    //this.getGaSetupByCampaignId();

    this.getAnalyticsData();
  }

  goToOverview(): void{
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    // this.router.navigate(['/integrations',{id : id}]);

    this.router.navigate(['/integrations', this.selectedCampId]);
  }

  getAnalyticsData(): void{
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    // this.router.navigate(['/integrations',{id : id}]);

    this.overvieswService.getGaAnalyticsReports(this.selectedCampId).subscribe(
      res =>{
          this.reportsData = res;
      }
    );
    

  }


  public getGaSetupByCampaignId(): void{

    let id = this.route.snapshot.paramMap.get('id');
  this.selectedCampId = `${id}`;

    this.integrationsService.getGaSetupByCampaignId(this.selectedCampId).subscribe(

      // this.states = this.selectService.getStates().filter((item) => item.countryid == countryid);

      res => {
        this.googleAnalyticsAccountSetupList = res;
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
        
        //distinct google account

        
      });
  };



}
