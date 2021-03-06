import { Component, Injector, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-layoutwithoutsidebar',
  templateUrl: './layoutwithoutsidebar.component.html',
  styleUrls: ['./layoutwithoutsidebar.component.scss']
})
export class LayoutwithoutsidebarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  navCollapsed = true; // for horizontal layout
  menuItems = []; // for horizontal layout
  router: Router;

  isNavSearchVisible: boolean;
  @ViewChild('fsbutton', { static: true }) fsbutton;  // the fullscreen button

  constructor(public menu: MenuService,
    public _openIdConnectService: OpenIdConnectService,
    public userblockService: UserblockService,
    public settings: SettingsService,
    public injector: Injector,
    public route: ActivatedRoute,
    public http: HttpClient,
    public datepipe: DatePipe,) {
    // show only a few items on demo
    //this.menuItems = menu.getMenu().slice(Math.max(menu.getMenu().length - 3, 1)); // for horizontal layout
  }
  logout() {
    this._openIdConnectService.triggerSignOut();
  }
  ngOnInit(): void {
    this.settings.setLayoutSetting('isCollapsedText', true);
    this.settings.setLayoutSetting('isFloat', true);

    this.isNavSearchVisible = false;

    var ua = window.navigator.userAgent;
    if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) { // Not supported under IE
      this.fsbutton.nativeElement.style.display = 'none';
    }

    // // Switch fullscreen icon indicator
    // const el = this.fsbutton.nativeElement.firstElementChild;
    // screenfull.on('change', () => {
    //   if (el)
    //     el.className = screenfull.isFullscreen ? 'fa fa-compress' : 'fa fa-expand';
    // });

    this.router = this.injector.get(Router);

    // Autoclose navbar on mobile when route change
    this.router.events.subscribe((val) => {
      // scroll view to top
      window.scrollTo(0, 0);
      // close collapse menu
      this.navCollapsed = true;
    });


  }

  // show only a few items on demo
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

 
  ngOnDestroy(): void {
    this.settings.setLayoutSetting('isCollapsedText', false);
    this.settings.setLayoutSetting('isFloat', false);
  }

}
