import { Component, HostBinding, OnInit } from '@angular/core';

import { SettingsService } from './core/settings/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.getLayoutSetting('isFixed'); };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.getLayoutSetting('isCollapsed'); };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.getLayoutSetting('isBoxed'); };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.getLayoutSetting('useFullLayout'); };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.getLayoutSetting('hiddenFooter'); };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.getLayoutSetting('horizontal'); };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.getLayoutSetting('isFloat'); };
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.getLayoutSetting('offsidebarOpen'); };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.getLayoutSetting('asideToggled'); };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.getLayoutSetting('isCollapsedText'); };

    constructor(public settings: SettingsService) { }

    ngOnInit() {
        
        let gacode = localStorage.getItem("isga");
        if (gacode == "1") {
            if (window.location.href.includes("/signin-oidc#id_token=") == false) {
                var ycode = window.location.search.substring(
                    window.location.search.lastIndexOf("code=") + 1,
                    window.location.search.lastIndexOf("&scope")
                );
                if(ycode!=""){
                ycode = ycode.replace("ode=", "");
                localStorage.setItem('gacode', ycode);
                }
                localStorage.setItem("isga",'');
            }
        }
        let gsccode = localStorage.getItem("isgsc");
        if (gsccode == "1") {
            if (window.location.href.includes("/signin-oidc#id_token=") == false) {
                var ycode = window.location.search.substring(
                    window.location.search.lastIndexOf("code=") + 1,
                    window.location.search.lastIndexOf("&scope")
                );
                if(ycode!=""){
                ycode = ycode.replace("ode=", "");
                localStorage.setItem('gsccode', ycode);
                }
                localStorage.setItem("isgsc",'');
            }
        }
        let instacode = localStorage.getItem("isinsta");
        if (instacode == "1") {
            if (window.location.href.includes("/signin-oidc#id_token=") == false) {
                var ycode = window.location.search.substring(
                    window.location.search.lastIndexOf("code=") + 1,
                    window.location.search.length
                );
                if(ycode!=""){
                ycode = ycode.replace("ode=", "");
                localStorage.setItem('instacode', ycode);
                }
                localStorage.setItem("isinsta",'');
            }
        }
        // prevent empty links to reload the page
        document.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && ['', '#'].indexOf(target.getAttribute('href')) > -1)
                e.preventDefault();
        });
    }
}
