import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { CampaignService } from '../../campaign/campaign.service';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit {
  sub: any;
  public campaignid: string;
  public selectedCampaign:any;

  constructor( public http: HttpClient,public adminService: AdminService, private openIdConnectService: OpenIdConnectService, public campaignService: CampaignService,public route: ActivatedRoute, 
    private router: Router,location: PlatformLocation) { 
      this.getCampaignList();
      location.onPopState(() => {


    });
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.campaignid = params.campaignid;
  });
  }

  //to get campaignList to select campaign name
  public getCampaignList(): void {
    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
        let selectedcampaign = res.filter((s,i)=>{
          if(s.id == this.campaignid){
            return s
          }
        })   
           this.selectedCampaign = selectedcampaign[0]    
    });

}


}
