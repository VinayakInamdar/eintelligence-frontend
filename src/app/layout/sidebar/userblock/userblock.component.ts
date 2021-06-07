import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';

import { UserblockService } from './userblock.service';

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    user: any;
    public userName:any;
    public role:any;
    constructor(public userblockService: UserblockService, public openIdConnectService: OpenIdConnectService,public settingsservice:SettingsService) {

        this.user = {
            picture: 'assets/img/user/01.jpg'
        };
    }

    ngOnInit() {
        this.userName = this.openIdConnectService.user.profile.given_name;
        this.role = this.settingsservice.selectedCompanyInfo.role;
    }

    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }

}
