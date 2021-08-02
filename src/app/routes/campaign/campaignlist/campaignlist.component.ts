import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CampaignService } from '../campaign.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/core/settings/settings.service';
const success = require('sweetalert');
import { MenuService } from '../../../core/menu/menu.service';
import { menu } from '../../../routes/menu';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-campaignlist',
  templateUrl: './campaignlist.component.html',
  styleUrls: ['./campaignlist.component.scss']
})
export class CampaignlistComponent implements OnInit {
  campaignList = [];
  CampaignGAList = [];
  CampaignGSCList = [];
  CampaignGAdsList = [];
  CampaignFacebookList = [];
  SelectedCampaignId;
  ableToAddNewProject: boolean = true;
  gaid;
  gamasterCampaignId;
  gscid;
  masterCampaignId;
  gaaccesstoken;
  gscaccesstoken;

  constructor(private translate: TranslateService, public campaignService: CampaignService, public router: Router, public route: ActivatedRoute, public settingsservice: SettingsService
    , public menuService: MenuService, private openIdConnectService: OpenIdConnectService, public http: HttpClient) { }

  ngOnInit() {
    this.getCampaignGA();
    this.getCampaignGSC();
    this.getCampaignList();

    this.getCampaignGAds();
    this.getCampaignFacebook();

    if (this.settingsservice.selectedCompanyInfo.role == "Client User") {
      this.menuService.menuCreation(menu);

      this.ableToAddNewProject = false;
    }

    if (this.settingsservice.selectedCompanyInfo.role == "Normal User" || this.settingsservice.selectedCompanyInfo.role == "Client User") {
      this.settings.actions.custom[3].name = "";
      this.settings.actions.custom[3].title = "";


    }
  }
  settings = {
    defaultStyle: false,
    attr: {
      class: 'table table-responsive',

    },

    actions: {
      columnTitle: '',
      custom: [{ name: 'editCampaign', title: '<span class="col-md-6"></span><i class="fas fa-edit"></i>' },
      { name: 'deleteCampaign', title: '<span class="text-danger col" style="padding-left:1rem"><i class="fas fa-trash-alt"></i></span>' },
      { name: 'onCampaignSelect', title: '<i class="fas fa-user"></i>' },
      { name: 'showCampaignFulfillment', title: '<span class="col"><i class="fas fa-store"></i></span>' }
        // { name: 'viewReports', title: '<i class="fas fa-chart-bar"></i>' }  
      ],
      add: false, edit: false, delete: false, position: 'right'
    },
    columns: {
      name: {
        title: 'NAME',
        filter: false
      },
      webUrl: {
        title: 'WEBURL',
        filter: false,
        type: 'html',
        valuePrepareFunction: (value) => {
          ;
          let a = value;
          let b = "https://www.";
          let c = b.concat(a);
          return `<a href=` + c + `  target="_blank" rel="noopener noreferrer">` + a + `</a>`;
        }
      },
      // ranking: {
      //   title: 'RANKING',
      //   filter: false,
      //   hide:true
      // },
      // traffic: {
      //   title: 'TRAFFIC',
      //   filter: false,
      //   hide: true
      // },
      // gsc: {
      //   title: 'GSC',
      //   filter: false,
      //   hide: true
      // },
      // socialMedia: {
      //   title: 'SOCIAL MEDIA',
      //   filter: false,
      //   hide: true
      // },
      // googleLeads: {
      //   title: 'GOOGLE ADS',
      //   filter: false,
      //   hide: true
      // }


    }
  }
  source: LocalDataSource;

  // using to get list of campaigns
  public getCampaignList(): void {

    var userid = this.openIdConnectService.user.profile.sub;
    //var userid = localStorage.getItem("userID");
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;

      if (this.settingsservice.selectedCompanyInfo.role == "Client User") {
        //generate new access token and update it in ssms
        for (let i = 0; i < this.campaignList.length; i++) {
          let ga = this.CampaignGAList.filter(x => x.campaignID == res[i].id);
          if (ga != null && ga != undefined && ga.length > 0) {

            this.gaid = ga[0]['id'];
            this.gamasterCampaignId = ga[0]['campaignID'];
            this.refreshGoogleAnalyticsAccount(i, ga[0]['refreshToken'], ga[0]['urlOrName']);
          }
          ;
          let gsc = this.CampaignGSCList.filter(x => x.campaignID == res[i].id);
          if (gsc != null && gsc != undefined && gsc.length > 0) {

            this.gscid = gsc[0]['id'];
            this.masterCampaignId = gsc[0]['campaignID'];
            this.refreshGSCAccount(i, gsc[0]['refreshToken'], gsc[0]['urlOrName']);
          }
        }
      }

      this.source = new LocalDataSource(this.campaignList)
    });
  }
  refreshGoogleAnalyticsAccount(campaignIndex, refreshToken, gaUrl) {

    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: refreshToken,// 'ya29.a0AfH6SMCszj8kAk7Q4lV43Q0vsJWDKmmmYkSYnwPclmY1La7BesHF7-5KuwdX1s4MlllQafsCGCjmQ9oO3K4jtFB6wMvDiuWjRsYpGQxkKzpwoUvph8e5OWG_Fy0bCUYAe_NiJ0x8gUkhM98seOhBPvNE1znZ',
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {

        this.gaaccesstoken = res['access_token'];
        this.modifyGaToken(gaUrl, refreshToken);

      }
    }, error => {

    });
  }
  modifyGaToken(gaUrl, refreshToken) {
    let data = {
      id: this.gaid,
      urlOrName: gaUrl,
      isActive: true,
      CampaignID: this.gamasterCampaignId,
      accessToken: this.gaaccesstoken,
      refreshToken: refreshToken
    }
    this.campaignService.updateGA(this.gaid, data).subscribe(response => {

      this.getCampaignGA();
    });
  }
  refreshGSCAccount(campaignIndex, refreshToken, gscurl) {
    ;
    const url = "https://www.googleapis.com/oauth2/v4/token";
    let data = {};
    data = {
      client_id: environment.googleClientId,
      client_secret: environment.googleClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      access_type: 'offline'
    };
    this.http.post(url, data).subscribe(res => {
      if (res) {
        this.gscaccesstoken = res['access_token'];
        this.modifyGscToken(gscurl, refreshToken);
      }
    }, error => {

    });
  }
  modifyGscToken(gscurl, refreshToken) {
    let data = {
      id: this.gscid,
      urlOrName: gscurl,
      isActive: true,
      CampaignID: this.masterCampaignId,
      accessToken: this.gscaccesstoken,
      refreshToken: refreshToken
    }
    this.campaignService.updateGSC(this.gscid, data).subscribe(response => {

      this.getCampaignGSC();
    });
  }
  //using to check setup and get analytics data with selected campaign Id
  userRowSelect(campaign: any): void {
    localStorage.setItem('gaurl', '');
    localStorage.setItem('gaaccesstoken', '');
    localStorage.setItem('gadsaccesstoken', '');
    localStorage.setItem('facebookurl', '');
    localStorage.setItem('facebookaccesstoken', '');
    localStorage.setItem('gscurl', '');
    localStorage.setItem('gscaccesstoken', '');
    localStorage.setItem('selectedCampName', '');
    localStorage.setItem('selectedCampUrl', '');
    this.SelectedCampaignId = campaign.data.id;
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
    localStorage.setItem('editMasterId', campaign.data.id);
    localStorage.setItem('selectedCampId', campaign.data.id);
    localStorage.setItem('selectedCampName', campaign.data.name);
    localStorage.setItem('selectedCampUrl', campaign.data.webUrl);
    this.router.navigate([`../campaign/:id${campaign.data.id}/seo`]);
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
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGA(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.CampaignGAList = response.body;

      }
    })
  }
  getCampaignGAds() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGAds(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.CampaignGAdsList = response.body;
      }
    })
  }
  getCampaignGSC() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGSC(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.CampaignGSCList = response.body;
      }
    })
  }
  getCampaignFacebook() {
    //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredFacebook(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.CampaignFacebookList = response.body;
      }
    })
  }
  public AddCampaign(): any {
    localStorage.setItem('gaurl', '');
    localStorage.setItem('gaaccesstoken', '');
    localStorage.setItem('gadsaccesstoken', '');
    localStorage.setItem('facebookurl', '');
    localStorage.setItem('facebookaccesstoken', '');
    localStorage.setItem('gscurl', '');
    localStorage.setItem('gscaccesstoken', '');
    localStorage.setItem('selectedCampName', '');
    localStorage.setItem('selectedCampUrl', '');
    localStorage.setItem('editMasterId', '');
    localStorage.setItem('gaid', '');
    localStorage.setItem('gadsid', '');
    localStorage.setItem('facebookid', '');
    localStorage.setItem('gscid', '');
    this.router.navigate(['/home/campaign']);
  }

  // public EditCampaign(){
  //   localStorage.setItem('editMasterId',"61D5FC99-79F7-49CE-E0AD-08D8E9D14B80");
  //   localStorage.setItem('selectedCampName', 'cyberralegalservices');
  //   localStorage.setItem('selectedCampUrl', 'cyberralegalservices.com');
  //   this.router.navigate(['/home/campaign']);
  // }
  viewReports(campaign) {
    localStorage.setItem('gaurl', '');
    localStorage.setItem('gaaccesstoken', '');
    localStorage.setItem('gadsaccesstoken', '');
    localStorage.setItem('facebookurl', '');
    localStorage.setItem('facebookaccesstoken', '');
    localStorage.setItem('gscurl', '');
    localStorage.setItem('gscaccesstoken', '');
    localStorage.setItem('selectedCampName', '');
    localStorage.setItem('selectedCampUrl', '');
    this.SelectedCampaignId = campaign.data.id;
    let ga = this.CampaignGAList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (ga != null && ga != undefined && ga.length > 0) {
      localStorage.setItem('gaurl', ga[0]['urlOrName']);
      localStorage.setItem('gaaccesstoken', ga[0]['accessToken']);
      localStorage.setItem('garefreshtoken', ga[0]['refreshToken']);
    }
    let gads = this.CampaignGAdsList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (gads != null && gads != undefined && gads.length > 0) {
      localStorage.setItem('gadsurl', gads[0]['urlOrName']);
      localStorage.setItem('gadsaccesstoken', gads[0]['accessToken']);
    }
    let facebook = this.CampaignFacebookList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (facebook != null && facebook != undefined && facebook.length > 0) {
      localStorage.setItem('facebookpagename', facebook[0]['urlOrName']);
      localStorage.setItem('facebookaccesstoken', facebook[0]['accessToken']);
    }
    let gsc = this.CampaignGSCList.filter(x => x.campaignID == this.SelectedCampaignId);
    if (gsc != null && gsc != undefined && gsc.length > 0) {
      localStorage.setItem('gscurl', gsc[0]['urlOrName']);
      localStorage.setItem('gscaccesstoken', gsc[0]['accessToken']);
      localStorage.setItem('gscrefreshtoken', ga[0]['refreshToken']);
    }
    localStorage.setItem('selectedCampId', campaign.data.id);
    localStorage.setItem('selectedCampName', campaign.data.name);
    localStorage.setItem('selectedCampUrl', campaign.data.webUrl);
    this.router.navigate([`../campaign/:id${campaign.data.id}/seo`]);
  }
  onCustomAction(event) {
    switch (event.action) {
      case 'editCampaign':
        this.editCampaign(event.data);
        break;
      case 'deleteCampaign':
        this.deleteCampaign(event.data);
        break;
      case 'onCampaignSelect':
        this.onCampaignSelect(event.data);
        break;
      case 'showCampaignFulfillment':
        this.goToCampaignFulfillment(event.data);
    }
  }
  onCampaignSelect(campaign: any) {
    this.settingsservice.selectedCampaignId = campaign.id;
    this.router.navigate(['/campaignuser-list']);
  }

  goToCampaignFulfillment(campaign: any) {
    this.settingsservice.selectedCampaignId = campaign.id;
    this.router.navigate(['/campaignfulfillment-list']);
  }
  editCampaign(campaign: any) {
    localStorage.setItem('gaurl', '');
    localStorage.setItem('gaaccesstoken', '');
    localStorage.setItem('gadsaccesstoken', '');
    localStorage.setItem('facebookurl', '');
    localStorage.setItem('facebookaccesstoken', '');
    localStorage.setItem('gscurl', '');
    localStorage.setItem('gscaccesstoken', '');
    localStorage.setItem('selectedCampName', '');
    localStorage.setItem('selectedCampUrl', '');
    localStorage.setItem('editMasterId', '');
    localStorage.setItem('gaid', '');
    localStorage.setItem('gadsid', '');
    localStorage.setItem('facebookid', '');
    localStorage.setItem('gscid', '');
    this.SelectedCampaignId = campaign.id;
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
    localStorage.setItem('editMasterId', campaign.id);
    localStorage.setItem('selectedCampId', campaign.id);
    localStorage.setItem('selectedCampName', campaign.name);
    localStorage.setItem('selectedCampUrl', campaign.webUrl);
    this.router.navigate(['/home/campaign']);
  }

  deleteCampaign(event) {
    success({
      icon: this.translate.instant('sweetalert.WARNINGICON'),
      title: this.translate.instant('message.DELETEMSG'),
      buttons: {
        cancel: {
          text: this.translate.instant('sweetalert.CANCELBUTTON'),
          value: null,
          visible: true,
          className: "",
          closeModal: false
        },
        confirm: {
          text: this.translate.instant('sweetalert.CONFIRMBUTTON'),
          value: true,
          visible: true,
          className: "bg-danger",
          closeModal: false
        }
      }
    }).then((isConfirm: any) => {
      if (isConfirm) {
        ;
        this.campaignService.deleteCampaignById(event.id).subscribe(res => {
          ;
          success({
            icon: this.translate.instant('sweetalert.WARNINGICON'),
            title: this.translate.instant('message.DELETEMSG'),
            buttons: {
              confirm: {
                text: this.translate.instant('sweetalert.OKBUTTON'),
                value: true,
                visible: true,
                className: "bg-danger",
                closeModal: true,
              }
            }
          }).then((isConfirm) => {
            if (isConfirm) {
              //this.router.navigate(['/home']);
              window.location.reload();
            }
          })
        });
      } else {
        success({
          icon: this.translate.instant('sweetalert.WARNINGICON'),
          title: this.translate.instant('message.CANCLEMSG'),
          buttons: {
            confirm: {
              text: this.translate.instant('sweetalert.OKBUTTON'),
              value: true,
              visible: true,
              className: "bg-danger",
              closeModal: true,
            }
          }
        }).then((isConfirm) => {
          //this.router.navigate(['/home']);
          window.location.reload();
        })
      }
    });
  }
}

