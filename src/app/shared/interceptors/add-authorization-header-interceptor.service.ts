import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { SettingsService } from "../../core/settings/settings.service";
import { OpenIdConnectService } from "../services/open-id-connect.service";

@Injectable()
export class AddAuthorizationHeaderInterceptorService {

  constructor(private openIdConnectService: OpenIdConnectService, private settingService: SettingsService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (this.openIdConnectService.userAvailable) {
      var SelectedCompanyId: string = null;

      if (this.settingService.selectedCompanyInfo.companyId == null || this.settingService.selectedCompanyInfo.companyId == '' || this.settingService.selectedCompanyInfo.companyId == "") {
        SelectedCompanyId = "";
      }
      else {
        SelectedCompanyId = this.settingService.selectedCompanyInfo.companyId;
      }
      // add the access token as bearer token
      if (request.url.includes(environment.apiUrl)) {
        request = request.clone(
          {

            setHeaders: {
              Authorization: this.openIdConnectService.user.token_type
                + " " + this.openIdConnectService.user.access_token,
              'UserId': this.openIdConnectService.user.profile.sub,
              'SelectedCompanyId': SelectedCompanyId
            }
          });
      }
    }

    return next.handle(request);
  }
}
