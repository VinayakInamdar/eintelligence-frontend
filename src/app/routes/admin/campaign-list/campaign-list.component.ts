import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common'
import { Campaign } from '../../campaign/campaign.model';
import { HttpClient } from '@angular/common/http';
import { CampaignService } from '../../campaign/campaign.service';
import { IAgency } from '../agency.model';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {


  tableData: Campaign[];
  sub: Subscription;
    id: string;
    public agencyid:number;
  public agencyList: IAgency[];    
  agencies: any;
  constructor( public http: HttpClient,public adminService: AdminService, public campaignService: CampaignService,public route: ActivatedRoute, 
    private router: Router,location: PlatformLocation) { 
      this.getCampaignList();
      this.getAgencyList();
      location.onPopState(() => {

        console.log('pressed back!');
        // this.router.navigate(['/admin']);

    });
  }
  public time: IAgency[];
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
    this.sub = this.route.params.subscribe(params => {
      this.agencyid = + params.id;
      this.id = params['id'];
  });
  }

  public getCampaignList(): void {
      this.campaignService.getCampaign().subscribe(res => {
          this.campaignList = res;
          this.tableData = this.campaignList;            
      });
  }
  public getAgencyList(): void {
    this.adminService.getAgency().subscribe(
      res => {
        this.agencyList = res;   
        this.time = res;  
        console.log(this.agencies)   
    });
}
  public userRowSelect(event): any {
    this.router.navigate(['/admin/campaignlist/' + this.agencyid + '/' + event.data.id]);
  }

  public onChange(value) {
    console.log(value)
    this.agencyid = + value;
    this.router.navigate(['/admin/campaignlist/' + value],{replaceUrl: true});
    this.getCampaignList()
  }

}
