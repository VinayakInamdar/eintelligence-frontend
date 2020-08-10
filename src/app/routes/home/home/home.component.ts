import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    tableData: Campaign[];
    constructor( public http: HttpClient, public campaignService: CampaignService, private router: Router) { 
        this.getCampaignList();
    }

    settings = {
        actions:{add: false, edit:false, delete:false},
        columns: {
          id: {
            title: 'id'
          },
          name: {
            title: 'name'
          },
          webUrl: {
            title: 'webUrl'
          },
          moreTraffic: {
            title: 'moreTraffic'
          },
          sales: {
            title: 'sales'
          },
          leadGeneration: {
            title: 'leadGeneration'
          }
        }
      };
      public campaignList: Campaign[];

    ngOnInit() {
    }

    public getCampaignList(): void {
        this.campaignService.getCampaign().subscribe(res => {
            this.campaignList = res;
            this.tableData = this.campaignList;            
        });
    }
    public onClick(): any {
        this.router.navigate(['/home/campagin']);
      }

      userRowSelect(campaign: any) : void{

        this.router.navigate(['/home/overview', {id : campaign.data.id}]);
        
             
      }
}
