import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { OpenIdConnectService } from './open-id-connect.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private openIdConnectService: OpenIdConnectService, private settingService: SettingsService) {
    //super();
  }

  isSuperAdmin(): boolean {
    if (this.settingService.selectedCompanyInfo != null) {
      var role = this.settingService.selectedCompanyInfo.role;
      // Check if the User is a Super Admin
      // Claim will be set as SuperAdmin: True
      var isSuperAdmin = false;

      if (role == "Super Admin") {
        isSuperAdmin = true;
      }
      return isSuperAdmin;
    }
  }
  hasClaim(claimType: string): boolean {
    if (this.settingService.selectedCompanyInfo != null) {
      var role = this.settingService.selectedCompanyInfo.role;
      if (claimType != undefined) {
        var Claim = claimType.split(':');
      }
      var isSuperAdmin = this.isSuperAdmin();

      var isAdmin = this.isAdmin();

      // Is Claim present
      var isClaimPresent: boolean = false;
      debugger;
      // One of the conditions in matching. 
      if (Claim != undefined) {
        Claim.forEach(element => {
          // if the claim value is set to all it means that everyone has access to this element and it
          // should always be displayed. 
          if (element == role || element == 'All') {
            isClaimPresent = true;
          }

          if (isSuperAdmin == true) {
            isClaimPresent = true;
          }

        });
      }
      debugger;
      return isClaimPresent;
    }
  }
  isAdmin(): boolean {
    if (this.settingService.selectedCompanyInfo != null) {
      var role = this.settingService.selectedCompanyInfo.role;
      var isAdmin = false;
      if (role == "Admin") {
        isAdmin = true;
      }
      return isAdmin;
    }
  }
}
