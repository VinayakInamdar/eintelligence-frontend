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


  constructor(public campaignService:CampaignService, public router: Router) { }

  ngOnInit() {
    this.getCampaignList();
    this.getRankingGraphData();
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
    debugger
    this.campaignService.getCampaign(userid).subscribe(res => {
      this.campaignList = res;
      this.source = new LocalDataSource(this.campaignList)      
    });
  }
   //using to check setup and get analytics data with selected campaign Id
   userRowSelect(campaign: any): void {
     debugger
      localStorage.setItem('selectedCampId', campaign.data.id);
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
    getRankingGraphData() {
      //  this.barData.datasets[0].data = [10,20,34,6,43,12,56,86,5,33,24,55]
      const filterOptionModel = this.getFilterOption();
      this.campaignService.getFilteredGA(filterOptionModel).subscribe((response: any) => {
        if (response) {
          debugger
          this.CampaignGAList = response.body;
        }
      })
    }
}

