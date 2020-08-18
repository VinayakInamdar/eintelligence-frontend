import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { AuditsService } from '../../audits/audits.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    tableData: Campaign[];
    siteurl: string;
    constructor( public http: HttpClient, public campaignService: CampaignService, private router: Router,
      public auditsService:AuditsService) { 
        this.getCampaignList();
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
          moreTraffic: {
            title: 'MORE TRAFFIC',
            filter : false
          },
          sales: {
            title: 'SALES',
            filter : false
          },
          leadGeneration: {
            title: 'LEAD GENERATION',
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
    public runAudit(event) {
       this.auditsService.settingsTaskWebsite(this.siteurl).subscribe(res=>{
        //  console.log(res)
       })
    }

    //using to open create campaign view to create new campaign in db
    public onClick(): any {
        this.router.navigate(['/home/campaign']);
      }
     
      // using to view analytics report of selected campaign Id
      userRowSelect(campaign: any) : void{

        this.router.navigate(['/home/overview', {id : campaign.data.id}]);
        
             
      }
}
