import { Component, OnInit } from '@angular/core';
import { OpenIdConnectService } from '../shared/services/open-id-connect.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SettingsService } from '../core/settings/settings.service';
import { MenuService } from '../core/menu/menu.service';
import { menu } from '../routes/menu';

@Component({
  selector: 'app-signin-oidc',
  templateUrl: './signin-oidc.component.html',
  styleUrls: ['./signin-oidc.component.scss']
})
export class SigninOidcComponent implements OnInit {

  constructor(private openIdConnectService: OpenIdConnectService,
    private router: Router, private settingsservice: SettingsService, public menuService: MenuService) { }

  ngOnInit() {
    ;

    this.openIdConnectService.userLoaded$.subscribe((userLoaded) => {
      ;
     
      if (userLoaded) {
        let cName = localStorage.getItem("selectedCompanyName");
        if (cName != undefined || cName !=null) {
          this.menuService.menuCreation(cName, menu);
          this.settingsservice.selectedCompanyInfo.companyId=cName;
          this.settingsservice.selectedCompanyInfo.role = localStorage.getItem("selectedCompanyRole");
          localStorage.removeItem("selectedCompanyName");
          localStorage.removeItem("selectedCompanyRole");
          this.router.navigate(['/home/campaign']);
          
        }
        else{
        this.router.navigate(['./company']);
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
