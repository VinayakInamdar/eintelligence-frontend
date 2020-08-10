import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { CampaignService } from '../../campaign/campaign.service';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit {
  sub: any;
  public campaignid: string;
  public selectedCampaign:any;

  constructor( public http: HttpClient,public adminService: AdminService, public campaignService: CampaignService,public route: ActivatedRoute, 
    private router: Router,location: PlatformLocation) { 
      this.getCampaignList();
      location.onPopState(() => {

        console.log('pressed back!');
        // this.router.navigate(['/admin']);

    });
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.campaignid = params.campaignid;
  });
  }
  public getCampaignList(): void {
    this.campaignService.getCampaign().subscribe(res => {
        let selectedcampaign = res.filter((s,i)=>{
          if(s.id == this.campaignid){
            return s
          }
        })   
           this.selectedCampaign = selectedcampaign[0]    
           console.log(this.selectedCampaign)  
    });

}
// public getCampaignById(id): void {
//   this.campaignService.getCampaignById(id).subscribe(res => {
//       this.campaignList = res;
//       this.tableData = this.campaignList;            
//   });
// }

}
