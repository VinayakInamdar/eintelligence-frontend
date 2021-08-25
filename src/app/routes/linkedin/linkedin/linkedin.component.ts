import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/core/menu/menu.service';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { menu } from '../../../routes/menu';
//import { LinkedInService } from 'angular-linkedin-sdk';
@Component({
  selector: 'app-linkedin',
  templateUrl: './linkedin.component.html',
  styleUrls: ['./linkedin.component.scss']
})
export class LinkedinComponent implements OnInit {

  linkedInCredentials = {
    clientId: "8656r2vems1tpw",
    redirectUrl: "https://localhost:4200/linkedin",
    scope: "r_liteprofile%20r_emailaddress%20r_organization_social" // To read basic user profile data and email
  };

  constructor(private http: HttpClient, private route: ActivatedRoute,public menuService: MenuService,
    public router: Router,public settingService:SettingsService) { }
  // accessToken;
  // private linkedInCredentials = {
  //   clientId: "77rl4v6oym4y16",
  //   redirectUrl: "https://localhost:4200/linkedin/linkedin"
  // };
  // settingActive;
  //constructor(private _linkedInService: LinkedInService) { }
  //   constructor(private http: HttpClient,  private activatedRoute: ActivatedRoute) {
  //  
  //     this.accessToken = this.activatedRoute.snapshot.queryParams["code"];
  //   }
  linkedInToken;
  public isUserAuthenticated;
  apiKey;
  ngOnInit() {
   
    if (localStorage.getItem("isLinkedinUserAuthenticated")) {
       
      this.linkedInToken = this.route.snapshot.queryParams["code"];
      localStorage.removeItem("isLinkedinUserAuthenticated");
      this.menuService.menuCreation(menu);
      this.settingService.selectedCompanyInfo.companyId = localStorage.getItem("selectedCompanyName");
      this.settingService.selectedCompanyInfo.role = localStorage.getItem("selectedCompanyRole");
      this.settingService.selectedCompanyInfo.companyImageUrl = localStorage.getItem("selectedCompanyImageUrl");
    }

  }
  
  // login() {
  //   window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
  //     this.linkedInCredentials.clientId
  //   }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=r_emailaddress`;
  // }
  // connectToLinkedIn() {
  //   let url = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
  //     this.linkedInCredentials.clientId
  //   }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=r_emailaddress`;
  //   this.http.get(url).subscribe(res => {
  //     if (res) {

  //     }
  //   }, error => {

  //     alert(error.message);
  //   });
  // let url = "https://www.linkedin.com/oauth/v2/accessToken";
  // let body = {
  // 	grant_type:"authorization_code",
  // 	code:"AQQkyz3W6F58reu6QnRnXhi2l5mA6CevvQaArjhwEgjgFWE9elVAu-eesvajzCM7wrfgYKl4X_tKGkenct44x9EZii6x2646G3xbQP62K_gqPWjhj5NqkqtfAW_rIMEppAIrYnom0lwyKD8Lfs3T_fKukyWllR1GK_wNJmHrjnZbH4HR8Gjm8I9ibcZNeQ",
  // 	redirect_uri:"http://localhost:4200/component/linkedin/callback",
  // 	client_id:"866ucec32xxjp9",
  // 	client_secret:"s2bKnc6Zjet6M9ZB"
  // }
  // this.http.post(url, body).subscribe(res => {
  // 	if (res) {
  // 	}
  // }, error => {
  // 	alert(error.message);
  // });

  //}
  login() {
     
    localStorage.setItem("selectedCompanyName", this.settingService.selectedCompanyInfo.companyId);
    localStorage.setItem("selectedCompanyRole", this.settingService.selectedCompanyInfo.role);
    localStorage.setItem("selectedCompanyImageUrl", this.settingService.selectedCompanyInfo.companyImageUrl);
    localStorage.setItem("isLinkedinUserAuthenticated", "true");

    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${this.linkedInCredentials.clientId
      }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  }
}
