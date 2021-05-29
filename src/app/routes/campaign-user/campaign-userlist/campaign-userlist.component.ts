import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { CampaignService } from '../../campaign/campaign.service';
import { CampaignUserModel } from './campaignusermodel';

@Component({
  selector: 'app-campaign-userlist',
  templateUrl: './campaign-userlist.component.html',
  styleUrls: ['./campaign-userlist.component.scss']
})
export class CampaignUserlistComponent implements OnInit {

  superAdmin; 
  userId; 
  companyId;
  campaignId;
  selectedUserId;
  CampaignUserList:Array<CampaignUserModel>
  constructor(public openIdConnectService: OpenIdConnectService,
    private fb: FormBuilder,
    private router: Router,
    private campaignService: CampaignService,
    private actr: ActivatedRoute, public settingsservice: SettingsService) { }

  ngOnInit(): void {
    this.getAllCampaignUserList();
  }

  getAllCampaignUserList(){
debugger;
    this.superAdmin = this.openIdConnectService.user.profile.super_admin;
    this.userId = this.openIdConnectService.user.profile.sub;
    this.companyId = this.settingsservice.selectedCompanyInfo.companyId;
    this.campaignId=this.settingsservice.selectedCampaignId;
    this.campaignService.getAllUsers(this.userId, this.companyId, this.superAdmin,this.campaignId).subscribe((res: any) => {
      debugger;

      this.CampaignUserList = new Array<CampaignUserModel>();
      for (let u in res) {
        var staff = new CampaignUserModel();
        staff.id = res[u].id;
        staff.fName = res[u].fName;
        staff.lName = res[u].lName;
        staff.emailID = res[u].email;
       
        staff.CompanyRole = res[u].companyRole;
        this.CampaignUserList.push(staff);
      }
    });
  }

  onCampaignUserSelect(value:any){
    debugger;
    this.selectedUserId=value;
    this.campaignService.deleteCampaignUserById(this.selectedUserId,this.campaignId).subscribe((res:any)=>{
      debugger;
      this.getAllCampaignUserList();
    })
  }
}
