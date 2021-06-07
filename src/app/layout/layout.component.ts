import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { SettingsService } from '../core/settings/settings.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    showLoadingIndicator: boolean = true;
    constructor(public settings: SettingsService, private router: Router) {

        this.router.events.subscribe((routerEvent: RouterEvent) => {
            if (routerEvent instanceof NavigationStart) {
                this.showLoadingIndicator = true;
            }
            if (routerEvent instanceof NavigationEnd) {
                this.showLoadingIndicator = false;
            }
        });
    }

    ngOnInit() {
        // this.settings.setLayoutSetting('isCollapsedText', false);
        // this.settings.setLayoutSetting('isFloat', false);
    }

}
