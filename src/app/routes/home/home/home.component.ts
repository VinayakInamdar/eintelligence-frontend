import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { AuditsService } from '../../audits/audits.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    tableData: Campaign[];
    siteurl: string;
    showProgressbar: boolean = false;
    toaster: any;
    valForm: FormGroup;
    public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });
    public pieChartLabels1 = ['Positive', 'Negative', 'Neutral'];
    public pieChartData1 = [5, 1, 1];
    public pieChartType1 = 'pie';
    public pieOptions1 = { 
      legend: {
      display: false
            }
    };
 
    public pieChartLabels2 = ['Positive', 'Negative', 'Neutral'];
    public pieChartData2 = ['75' , '36', '55'];
    public pieChartType2 = 'pie';
    public pieOptions2 = { 
      legend: {
      display: false
            }
    };


    public pieChartLabels3 = ['Positive', 'Negative', 'Neutral'];
    public pieChartData3 = ['85', '75', '65'];
    public pieChartType3 = 'pie';
    public pieOptions3 = { 
      legend: {
      display: false
            }
    };

    public pieChartLabels4 = ['Positive', 'Negative', 'Neutral'];
    public pieChartData4 = ['45', '66', '59'];
    public pieChartType4 = 'pie';
    public pieOptions4 = { 
      legend: {
      display: false
            }
    };

    public pieChartLabels5 = ['Positive', 'Negative', 'Neutral'];
    public pieChartData5 = ['45', '88', '52'];
    public pieChartType5 = 'pie';
    public pieOptions5 = { 
      legend: {
      display: false
            }
    };

    public pieChartLabels6 = ['Positive', 'Negative', 'Neutral'];
    public pieChartData6 = ['25', '66', '70'];
    public pieChartType6 = 'pie';
    public pieOptions6 = { 
      legend: {
      display: false
            }
    };


    constructor( public http: HttpClient, public campaignService: CampaignService, private router: Router,
      public auditsService:AuditsService,public toasterService: ToasterService,public toastr : ToastrService
      ,fb: FormBuilder,) { 
        this.getCampaignList();
        this.toaster = {
          type: 'success',
          title: 'Audit report',
          text: 'Your report is ready..'
      };

      this.valForm = fb.group({
        'webUrl': [undefined,[Validators.required,Validators.pattern(this.myreg)]],     
    })
    }

    settings = {
        actions:{add: false, edit:false, delete:false},
        columns: {
          name: {
            title: 'NAME',
            filter: false
          },
          webUrl: {
            title: 'WEBURL',
            filter: false
          },
          ranking: {
            title: 'RANKING',
            filter : false
          },
          traffic: {
            title: 'TRAFFIC',
            filter : false
          },
          socialMedia: {
            title: 'SOCIAL MEDIA',
            filter : false
          },
          googleLeads: {
            title: 'GOOGLE LEADS',
            filter : false
          }
        }
      };
      source: LocalDataSource;
      public campaignList: Campaign[];

    ngOnInit() {
    }
    
      //  using to get campaignList
    public getCampaignList(): void {
        this.campaignService.getCampaign().subscribe(res => {

         res[0].ranking = 2;
         res[1].ranking = 3;
         res[2].ranking = 0;
         res[3].ranking = -1;     
         
         res[0].traffic = '75%';
         res[1].traffic = '36%';
         res[2].traffic = '55%';
         res[3].traffic = '56%';  


         res[0].socialMedia ='85%'
         res[1].socialMedia = '75%'
         res[2].socialMedia = '45%'
         res[3].socialMedia = '65%' 

         res[0].googleLeads = '45%'
         res[1].googleLeads = '45%'
         res[2].googleLeads = '75%'
         res[3].googleLeads = '25%'  
            
         this.campaignList = res;            
            this.tableData = this.campaignList;


            this.source = new LocalDataSource(this.campaignList)             
        });
    }
    
    // using to view list of audits
    public goToAudits(event) {
      event.preventDefault()
      this.router.navigate(['/home/audits']);
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
    // using to run audit of entered url 
    public runAudit(event,value) {
      if (this.valForm.invalid) {
        this.valForm.get('webUrl').markAsTouched();
      }
      else {
        this.toastr.info('Your Report is under progress...you can see your report when it is completed','Audit Report')
        this.auditsService.settingsTaskWebsite(this.siteurl).subscribe(res=>{
 
        })
      }

    }

    //using to open create campaign view to create new campaign in db
    public onClick(): any {
        this.router.navigate(['/home/campaign']);
      }
     
      // using to view analytics report of selected campaign Id
      userRowSelect(campaign: any) : void{

        this.router.navigate(['/campaign', {id : campaign.data.id}],{queryParams: {
          view: 'showReport'
        },});
        
             
      }
  
}
