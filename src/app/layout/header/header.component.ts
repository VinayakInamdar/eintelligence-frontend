import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
const screenfull = require('screenfull');

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { Observable } from 'rxjs';
import { OpenIdConnectService } from '../../shared/services/open-id-connect.service';
import { Campaign } from 'src/app/routes/campaign/campaign.model';
import { CampaignService } from 'src/app/routes/campaign/campaign.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isLoggedIn$: Observable<boolean>;

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout
    router: Router;

    isNavSearchVisible: boolean;
    @ViewChild('fsbutton', { static: true }) fsbutton;  // the fullscreen button

    campaignList: Campaign[];
    CampaignGAList = [];
    CampaignGSCList = [];
    CampaignGAdsList = [];
    CampaignFacebookList = [];
    selectedCampId: string;
    SelectedCampaignId;
    selectedCampaignName: string;
    selectedCampName;

    constructor(public menu: MenuService, public _openIdConnectService: OpenIdConnectService, public userblockService: UserblockService, public settings: SettingsService, public injector: Injector

        , private campaignService: CampaignService, public route: ActivatedRoute, public http: HttpClient, public datepipe: DatePipe, private snackbarService: SnackbarService) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(Math.max(menu.getMenu().length - 3, 1)); // for horizontal layout
        let id = this.route.snapshot.paramMap.get('id');
        this.selectedCampId = `${id}`;
        //this.getCampaignList();


    }
    logout() {
        this._openIdConnectService.triggerSignOut();
    }
    ngOnInit() {
        this.getCampaignGA();
        this.getCampaignGAds();
        this.getCampaignFacebook();
        this.getCampaignGSC();
        this.getCampaignList();
        this.isNavSearchVisible = false;

        var ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }

        // Switch fullscreen icon indicator
        const el = this.fsbutton.nativeElement.firstElementChild;
        screenfull.on('change', () => {
            if (el)
                el.className = screenfull.isFullscreen ? 'fa fa-compress' : 'fa fa-expand';
        });

        this.router = this.injector.get(Router);

        // Autoclose navbar on mobile when route change
        this.router.events.subscribe((val) => {
            // scroll view to top
            window.scrollTo(0, 0);
            // close collapse menu
            this.navCollapsed = true;
        });


    }

    toggleUserBlock(event) {
        event.preventDefault();
        this.userblockService.toggleVisibility();
    }

    openNavSearch(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setNavSearchVisible(true);
    }

    setNavSearchVisible(stat: boolean) {
        // console.log(stat);
        this.isNavSearchVisible = stat;
    }

    getNavSearchVisible() {
        return this.isNavSearchVisible;
    }

    toggleOffsidebar() {
        this.settings.toggleLayoutSetting('offsidebarOpen');
    }

    toggleCollapsedSideabar() {
        this.settings.toggleLayoutSetting('isCollapsed');
    }

    isCollapsedText() {
        return this.settings.getLayoutSetting('isCollapsedText');
    }

    toggleFullScreen(event) {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

    // using to get campaignList
    public getCampaignList(): void {     
        var userid = this._openIdConnectService.user.profile.sub;
        this.campaignService.getCampaign(userid).subscribe(res => {
            this.campaignList = res;
            var name = "";
            if (this.selectedCampId == ":id") {
                this.selectedCampId = this.campaignList[0].id
            }
            this.campaignList.map((s, i) => {
                if (s.id == this.selectedCampId) {
                    name = s.name
                }
            })
            this.selectedCampaignName = name !== "" ? name : undefined;

            for (let i = 0; i < res.length; i++) {
                let ga = this.CampaignGAList.filter(x => x.campaignID == res[i].id);
                if (ga != null && ga != undefined && ga.length > 0) {

                    //this.refreshGoogleAnalyticsAccount(i, ga[0]['refreshToken'], ga[0]['urlOrName']);
                }
                let gsc = this.CampaignGSCList.filter(x => x.campaignID == res[i].id);
                if (gsc != null && gsc != undefined && gsc.length > 0) {
                    // this.refreshGSCAccount(i, gsc[0]['refreshToken'], gsc[0]['urlOrName']);

                }
                let facebook = this.CampaignFacebookList.filter(x => x.campaignID == res[i].id);
                if (facebook != null && facebook != undefined && facebook.length > 0) {

                }
            }
        });
    }
    //setCampaignName:boolean=false;
    //using to get selected campaign name
    onCampaignSelect(event, selectedCampaign) {

        this.selectedCampaignName = selectedCampaign.name;

        this.selectedCampId = selectedCampaign.id;
        localStorage.setItem('gaurl', '');
        localStorage.setItem('gaaccesstoken', '');
        localStorage.setItem('gadsaccesstoken', '');
        localStorage.setItem('facebookurl', '');
        localStorage.setItem('facebookaccesstoken', '');
        localStorage.setItem('gscurl', '');
        localStorage.setItem('gscaccesstoken', '');
        localStorage.setItem('selectedCampName', '');
        localStorage.setItem('selectedCampUrl', '');
        this.SelectedCampaignId = selectedCampaign.id;
        let ga = this.CampaignGAList.filter(x => x.campaignID == this.SelectedCampaignId);
        if (ga != null && ga != undefined && ga.length > 0) {
            localStorage.setItem('gaurl', ga[0]['urlOrName']);
            localStorage.setItem('gaaccesstoken', ga[0]['accessToken']);
            localStorage.setItem('garefreshtoken', ga[0]['refreshToken']);
            localStorage.setItem('gaid', ga[0]['id']);
        }

        let gads = this.CampaignGAdsList.filter(x => x.campaignID == this.SelectedCampaignId);
        if (gads != null && gads != undefined && gads.length > 0) {
            localStorage.setItem('gadsurl', gads[0]['urlOrName']);
            localStorage.setItem('gadsaccesstoken', gads[0]['accessToken']);
            localStorage.setItem('gadsid', gads[0]['id']);

        }

        let facebook = this.CampaignFacebookList.filter(x => x.campaignID == this.SelectedCampaignId);
        if (facebook != null && facebook != undefined && facebook.length > 0) {
            localStorage.setItem('facebookpagename', facebook[0]['urlOrName']);
            localStorage.setItem('facebookaccesstoken', facebook[0]['accessToken']);
            localStorage.setItem('facebookid', facebook[0]['id']);

        }

        let gsc = this.CampaignGSCList.filter(x => x.campaignID == this.SelectedCampaignId);
        if (gsc != null && gsc != undefined && gsc.length > 0) {
            localStorage.setItem('gscurl', gsc[0]['urlOrName']);
            localStorage.setItem('gscaccesstoken', gsc[0]['accessToken']);
            localStorage.setItem('gscrefreshtoken', gsc[0]['refreshToken']);
            localStorage.setItem('gscid', gsc[0]['id']);

        }

        localStorage.setItem('selectedCampId', selectedCampaign.id);
        localStorage.setItem('selectedCampName', selectedCampaign.name);
        localStorage.setItem('selectedCampUrl', selectedCampaign.webUrl);


        this.router.navigate([`../campaign/:id${selectedCampaign.id}/seo`]);
    }
    private getFilterOption() {
        return {
            pageNumber: 1,
            pageSize: 1000,
            fields: '',
            searchQuery: '',
            orderBy: ''
        }

    }
    getCampaignGA() {

        const filterOptionModel = this.getFilterOption();
        this.campaignService.getFilteredGA(filterOptionModel).subscribe((response: any) => {
            if (response) {

                this.CampaignGAList = response.body;
            }
        })
    }
    getCampaignGAds() {

        const filterOptionModel = this.getFilterOption();
        this.campaignService.getFilteredGAds(filterOptionModel).subscribe((response: any) => {
            if (response) {

                this.CampaignGAdsList = response.body;
            }
        })
    }
    getCampaignFacebook() {

        const filterOptionModel = this.getFilterOption();
        this.campaignService.getFilteredFacebook(filterOptionModel).subscribe((response: any) => {
            if (response) {

                this.CampaignFacebookList = response.body;
            }
        })
    }
    getCampaignGSC() {

        const filterOptionModel = this.getFilterOption();
        this.campaignService.getFilteredGSC(filterOptionModel).subscribe((response: any) => {
            if (response) {

                this.CampaignGSCList = response.body;
            }
        })
    }


}
