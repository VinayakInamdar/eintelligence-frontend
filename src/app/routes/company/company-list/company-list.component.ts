import { Component, OnInit, Renderer2 } from '@angular/core';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { CampaignService } from '../../campaign/campaign.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { companyInfo } from './companymodel';
import { Router } from '@angular/router';
@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  companysList: Array<companyInfo>;
  constructor(public openIdConnectService: OpenIdConnectService, private campaignService: CampaignService, private renderer: Renderer2, public settingsservice: SettingsService, public router: Router) { }

  ngOnInit(): void {
    var superAdmin = this.openIdConnectService.user.profile.super_admin;
    var userId = this.openIdConnectService.user.profile.sub;
    if (superAdmin == undefined) {
      superAdmin = false;
    }
    this.campaignService.getCompanysList(superAdmin, userId).subscribe((res: any) => {
      // this.settingservice.companyListInfo=res;
      //this.companys=res;
      this.companysList = new Array<companyInfo>();
      for (let u in res) {
        var company = new companyInfo();
        company.role = res[u].role;
        company.companyId = res[u].companyID;
        company.name = res[u].name;
        company.companyType = res[u].companyType;
        company.description = res[u].description;
        this.companysList.push(company);
      }
    });


  }

  onClickCompany(company: any) {
    ;
    let a = company;
    this.settingsservice.selectedCompanyInfo.companyId = a.companyId;
    this.settingsservice.selectedCompanyInfo.companyType = a.companyType;
    this.settingsservice.selectedCompanyInfo.description = a.description;
    this.settingsservice.selectedCompanyInfo.name = a.name;
    this.settingsservice.selectedCompanyInfo.role = a.role;

    this.router.navigate(['/home']);
  }

}
