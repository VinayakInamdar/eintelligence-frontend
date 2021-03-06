import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common'
import { Campaign } from '../../campaign/campaign.model';
import { HttpClient } from '@angular/common/http';
import { CampaignService } from '../../campaign/campaign.service';
import { IAgency } from '../agency.model';
import { AdminService } from '../admin.service';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
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
  constructor( public http: HttpClient,public adminService: AdminService, private openIdConnectService: OpenIdConnectService, public campaignService: CampaignService,public route: ActivatedRoute, 
    private router: Router,location: PlatformLocation) { 
      this.getCampaignList();
      this.getAgencyList();
      location.onPopState(() => {


    });
  }
  public time: IAgency[];
  settings = {
      actions:{add: false, edit:false, delete:false},
      columns: {
        name: {
          title: 'NAME'
        },
        webUrl: {
          title: 'WEBURL'
        },
        moreTraffic: {
          title: 'MORETRAFFIC'
        },
        sales: {
          title: 'SALES'
        },
        leadGeneration: {
          title: 'LEADGENERAION'
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
  //  using to get campaignList
  public getCampaignList(): void {
    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
          this.campaignList = res;
          this.tableData = this.campaignList;            
      });
  } 

  // using to get agencyList
  public getAgencyList(): void {
    this.adminService.getAgency().subscribe(
      res => {
        this.agencyList = res;   
        this.time = res;  
    });
} 

  // to go to campaignDetail page 
  public userRowSelect(event): any {
    this.router.navigate(['/admin/campaignlist/' + this.agencyid + '/' + event.data.id]);
  }
  
  // using to load campaignList of selected agency
  public onChange(value) {
    this.agencyid = + value;
    this.router.navigate(['/admin/campaignlist/' + value],{replaceUrl: true});
    this.getCampaignList()
  }

}
