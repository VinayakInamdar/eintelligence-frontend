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
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { AccountService } from '../../account/account.service';



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

    CompanyID:string;
    companyinformation:any;

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
      ,fb: FormBuilder,private openIdConnectService: OpenIdConnectService,private accountService: AccountService) { 
        this.getCampaignList();
        this.getCompany();
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

    getCompany() {

      var userId = this.openIdConnectService.user.profile.sub;
      this.accountService.getCompany(userId).subscribe(
        res=>{
          
          if(res){
            this.companyinformation = res
            this.CompanyID = this.companyinformation.companyID;

            localStorage.setItem('companyID', this.CompanyID);
            localStorage.setItem('userID',userId);

           
          }
         
        }
      )
    }
    
      //  using to get campaignList
    public getCampaignList(): void {
      var userid = this.openIdConnectService.user.profile.sub;
        this.campaignService.getCampaign().subscribe(res => {
          

        //   res.forEach((item) => {
        //     item.ranking = 1;
        //     item.traffic = "75%";
        //     item.googleLeads="45%";
        //     item.socialMedia="85%";
            
        // });

        for (let i = 0; i < res.length; i++) {
         if(i==1){
          res[i].ranking = 2;
          res[i].traffic = "75%";
          res[i].googleLeads="45%";
          res[i].socialMedia="85%";
         }else if(i==2){
          res[i].ranking = 1;
          res[i].traffic = "66%";
          res[i].googleLeads="48%";
          res[i].socialMedia="65%";

         }else if(i==0){
          res[i].ranking = 1;
          res[i].traffic = "44%";
          res[i].googleLeads="49%";
          res[i].socialMedia="55%";

         }
         else if(i==3){
          res[i].ranking = 1;
          res[i].traffic = "77%";
          res[i].googleLeads="66%";
          res[i].socialMedia="91%";
           
         }
         else if(i==4){
          res[i].ranking = 5;
          res[i].traffic = "41%";
          res[i].googleLeads="45%";
          res[i].socialMedia="85%";
        }
        else if(i==5){
          res[i].ranking = 1;
          res[i].traffic = "33%";
          res[i].googleLeads="95%";
          res[i].socialMedia="65%";
        }
        else if(i==6){
          res[i].ranking = 6;
          res[i].traffic = "68%";
          res[i].googleLeads="78%";
          res[i].socialMedia="81%";
        }
        else if(i==7){
          res[i].ranking = 3;
          res[i].traffic = "86%";
          res[i].googleLeads="66%";
          res[i].socialMedia="29%";
        }
        else if(i==8){
          res[i].ranking = 1;
          res[i].traffic = "71%";
          res[i].googleLeads="61%";
          res[i].socialMedia="51%";
        }
        else if(i==9){
          res[i].ranking = 1;
          res[i].traffic = "99%";
          res[i].googleLeads="92%";
          res[i].socialMedia="85%";
        }
        else if(i > 10){
          res[i].ranking = 1;
          res[i].traffic = "25%";
          res[i].googleLeads="45%";
          res[i].socialMedia="85%";
        }


        }

        //  res[0].ranking = 2;
        //  res[1].ranking = 3;
        //  res[2].ranking = 0;
        //  res[3].ranking = -1;     
         
        //  res[0].traffic = '75%';
        //  res[1].traffic = '36%';
        //  res[2].traffic = '55%';
        //  res[3].traffic = '56%';  


        //  res[0].socialMedia ='85%'
        //  res[1].socialMedia = '75%'
        //  res[2].socialMedia = '45%'
        //  res[3].socialMedia = '65%' 

        //  res[0].googleLeads = '45%'
        //  res[1].googleLeads = '45%'
        //  res[2].googleLeads = '75%'
        //  res[3].googleLeads = '25%'  
            
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
