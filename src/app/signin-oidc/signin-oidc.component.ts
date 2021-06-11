import { Component, OnInit } from '@angular/core';
import { OpenIdConnectService } from '../shared/services/open-id-connect.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SettingsService } from '../core/settings/settings.service';
import { MenuService } from '../core/menu/menu.service';
import { menu } from '../routes/menu';
import { CampaignService } from '../routes/campaign/campaign.service';
import { companyInfo } from '../routes/company/company-list/companymodel';

@Component({
  selector: 'app-signin-oidc',
  templateUrl: './signin-oidc.component.html',
  styleUrls: ['./signin-oidc.component.scss']
})
export class SigninOidcComponent implements OnInit {

  constructor(private openIdConnectService: OpenIdConnectService,
    private router: Router, private settingsservice: SettingsService, public menuService: MenuService, private campaignService: CampaignService) { }

  ngOnInit() {
    ;

    this.openIdConnectService.userLoaded$.subscribe((userLoaded) => {
      if (userLoaded) {
        let cName = localStorage.getItem("selectedCompanyName");
        if (cName != undefined || cName != null) {
          this.menuService.menuCreation(menu);
          this.settingsservice.selectedCompanyInfo.companyId = cName;
          this.settingsservice.selectedCompanyInfo.role = localStorage.getItem("selectedCompanyRole");
          this.settingsservice.selectedCompanyInfo.companyImageUrl = localStorage.getItem("selectedCompanyImageUrl");
          localStorage.removeItem("selectedCompanyName");
          localStorage.removeItem("selectedCompanyRole");
          localStorage.removeItem("selectedCompanyImageUrl");
          this.router.navigate(['/home/campaign']);

        }
        else {
          var superAdmin = this.openIdConnectService.user.profile.super_admin;
          var userId = this.openIdConnectService.user.profile.sub;
          if (superAdmin == undefined) {
            superAdmin = false;
          }
          this.campaignService.getCompanysList(superAdmin, userId).subscribe((res: any) => {
            if (res.length == 1) {
              this.settingsservice.selectedCompanyInfo.companyId = res[0].companyID;
              this.settingsservice.selectedCompanyInfo.companyType = res[0].companyType;
              this.settingsservice.selectedCompanyInfo.description = res[0].description;
              this.settingsservice.selectedCompanyInfo.name = res[0].name;
              this.settingsservice.selectedCompanyInfo.role = res[0].role;
              this.settingsservice.selectedCompanyInfo.companyImageUrl = res[0].companyImageUrl;
              if (this.settingsservice.selectedCompanyInfo.role == "Client User") {
                this.router.navigate(['/campaign']);
              }
              else {
                this.router.navigate(['/home']);
              }
            }
            else {
              this.router.navigate(['./company']);
            }
          });
        }
      }

      else {
        if (!environment.production) {
          console.log("An error happened: user wasn't loaded.");
        }
      }
    });

    this.openIdConnectService.handleCallback();
  }

}
