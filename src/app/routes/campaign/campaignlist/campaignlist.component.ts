import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CampaignService } from '../campaign.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-campaignlist',
  templateUrl: './campaignlist.component.html',
  styleUrls: ['./campaignlist.component.scss']
})
export class CampaignlistComponent implements OnInit {
  campaignList = [];
  CampaignGAList=[];
  CampaignGSCList=[];
  CampaignGAdsList=[];
  CampaignFacebookList=[];
  SelectedCampaignId;

  constructor(public campaignService:CampaignService, public router: Router) { }

  ngOnInit() {
    this.getCampaignList();
    this.getCampaignGA();
    this.getCampaignGAds();
    this.getCampaignFacebook();
    this.getCampaignGSC();
  }
  settings = {
    defaultStyle: false,
    attr: {
      class: 'table table-responsive',

    },

    actions: {
      add: false, edit: false, delete: false,
    },
    columns: {
      name: {
        title: 'NAME',
        filter: false
      },
      webUrl: {
        title: 'WEBURL',
        filter: false
      },
      ranking: {
        title: 'RANKING',
        filter: false
      },
      traffic: {
        title: 'TRAFFIC',
        filter: false
      },
      gsc: {
        title: 'GSC',
        filter: false
      },
      socialMedia: {
        title: 'SOCIAL MEDIA',
        filter: false
      },
      googleLeads: {
        title: 'GOOGLE ADS',
        filter: false
      }


    }
  }
  source: LocalDataSource;
  // using to get list of campaigns
  public getCampaignList(): void {
    var userid = localStorage.getItem("userID");
    
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      this.source = new LocalDataSource(this.campaignList)      
    });
  }
   //using to check setup and get analytics data with selected campaign Id
   userRowSelect(campaign: any): void {
     debugger
     this.SelectedCampaignId = campaign.data.id;
     let ga = this.CampaignGAList.filter(x => x.campaignID == this.SelectedCampaignId);
     if(ga !=null && ga != undefined && ga.length > 0){
      localStorage.setItem('gaurl', ga[0]['urlOrName']);
      localStorage.setItem('gaaccesstoken', ga[0]['accessToken']);
     }
     let gads = this.CampaignGAdsList.filter(x => x.campaignID == this.SelectedCampaignId);
     if(gads !=null && gads != undefined && gads.length > 0){
      localStorage.setItem('gadsurl', gads[0]['urlOrName']);
      localStorage.setItem('gadsaccesstoken', gads[0]['accessToken']);
     }
     let facebook = this.CampaignFacebookList.filter(x => x.campaignID == this.SelectedCampaignId);
     if(facebook !=null && facebook != undefined && facebook.length > 0){
      localStorage.setItem('facebookpagename', facebook[0]['urlOrName']);
      localStorage.setItem('facebookaccesstoken', facebook[0]['accessToken']);
     }
     let gsc = this.CampaignGSCList.filter(x => x.campaignID == this.SelectedCampaignId);
     if(gsc !=null && gsc != undefined && gsc.length > 0){
      localStorage.setItem('gscurl', gsc[0]['urlOrName']);
      localStorage.setItem('gscaccesstoken', gsc[0]['accessToken']);
     }
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
    this.router.navigate(['/home/campaign']);
  }

}

