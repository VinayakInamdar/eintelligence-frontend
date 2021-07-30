import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { MyPaymentsService } from '../../mypayments/mypayments.service';

@Component({
  selector: 'app-campaign-fullfillment',
  templateUrl: './campaign-fullfillment.component.html',
  styleUrls: ['./campaign-fullfillment.component.scss']
})
export class CampaignFullfillmentComponent implements OnInit {

  filteredPlans = [];
  tempPlanId: any;
  tempList = [];
  tempListId: any;
  constructor(public myPaymentsService: MyPaymentsService, public settingsService: SettingsService) { }

  ngOnInit(): void {

    const filterOptionModel = this.getFilterOptionPlans();
    this.myPaymentsService.getFilteredStripepayments(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.filteredPlans = response.body.filter((a) => a.campaignId == this.settingsService.selectedCampaignId);
        let p = this.filteredPlans;

        const removeById = (arr, id) => {
          const requiredIndex = arr.findIndex(el => {
            return el.id === String(id);
          });
          if (requiredIndex === -1) {
            return false;
          };
          return !!arr.splice(requiredIndex, 1);
        };
        for (let i = 0; i < p.length; i++) {
          this.tempPlanId = p[i].planId;
          this.tempList = this.filteredPlans.filter((a) => a.planId == this.tempPlanId);
          if (this.tempList.length > 1) {
            while (this.tempList.length != 1) {
              this.tempListId = this.tempList[this.tempList.length - 1].id;
              this.tempList.pop();
              removeById(this.filteredPlans, this.tempListId);
            }
          }
        }

        this.showPurchasedDatenTime();
      }
    })
  }

  showPurchasedDatenTime(){

    let purchasedDate;
    for(let i=0;i<this.filteredPlans.length;i++){
      purchasedDate=this.filteredPlans[i].createdOn.split("T");
      this.filteredPlans[i].purchasedDate=purchasedDate[0];
      this.filteredPlans[i].purchasedTime = new Date(this.filteredPlans[i].createdOn).toTimeString();
 
    }
  }

  private getFilterOptionPlans() {
    return {
      pageNumber: 1,
      pageSize: 1000,
      fields: '',
      searchQuery: '',
      orderBy: ''
    }

  }
}
