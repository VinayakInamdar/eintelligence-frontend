import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent implements OnInit {
  selectedCampId: string;
  campaignList: Campaign[];
  CampaignGAList = [];
  CampaignGSCList = [];
  CampaignGAdsList = [];
  CampaignFacebookList = [];
 
  SelectedCampaignId;
  selectedCampaignName: string;
  selectedCampName;

  constructor(public router: Router, public campaignService: CampaignService, public _openIdConnectService: OpenIdConnectService) {
    this.selectedCampId = localStorage.getItem("selectedCampId")
  }

  ngOnInit(): void {

    this.getCampaignGA();
    this.getCampaignGAds();
    this.getCampaignFacebook();
    this.getCampaignGSC();
    this.getCampaignList();
  }
  public goToSeoOverview(event) {
    this.router.navigate([`../campaign/:id${this.selectedCampId}/seo`])
  }
  public goToSocialMedia(event) {
    this.router.navigate([`/socialmedia`])
  }
  
  public goToTest(event) {
    this.router.navigate(['/campaign', { id: this.selectedCampId }], {
      queryParams: {
        view: 'showReport'
      },
    });

    //this.router.navigate([`/campaign/:id${this.selectedCampId}`])
  }
  goToGoogleAdsOverview(event){
    this.router.navigate([`/google-ads`])
  }
  
  onCampaignSelect(event, selectedCampaign) {

    this.selectedCampaignName = selectedCampaign.name;

    this.selectedCampId = selectedCampaign.id
    ;
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
    ;
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
    localStorage.setItem('editMasterId', selectedCampaign.id);
    localStorage.setItem('selectedCampId', selectedCampaign.id);
    localStorage.setItem('selectedCampName', selectedCampaign.name);
    localStorage.setItem('selectedCampUrl', selectedCampaign.webUrl);
    //this.router.navigate([`../campaign/:id${selectedCampaign.id}/seo`]);
    this.redirectTo(`../campaign/:id${selectedCampaign.id}/seo`);
  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate([uri]);
    })
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

  getCampaignGA() {

    const filterOptionModel = this.getFilterOption();
    this.campaignService.getFilteredGA(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.CampaignGAList = response.body;
        ;
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

  /*
  
  public goToSocialMedia(event) {

    this.router.navigate([`/socialmedia`])
  }
  public goToLinkedIn(event) {

    this.router.navigate([`/linkedin`])
  }
  public goToInstagram(event) {

    this.router.navigate([`/instagram`])
  }
  public goToGSC(event) {

    this.router.navigate([`/gsc`])
  }*/
}
