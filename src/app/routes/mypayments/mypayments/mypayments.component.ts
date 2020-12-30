import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { MyPaymentsService } from '../../mypayments/mypayments.service'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  templateUrl: './mypayments.component.html',
  styleUrls: ['./mypayments.component.scss']
})
export class MyPaymentsComponent implements OnInit {

  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  payments: any[];
  stripeSubscriptionId;
  constructor(public router: Router, public myPaymentsService: MyPaymentsService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllPaymants();
  }
 
  public cancleSubscription(StripeSubscriptionId): any {
    this.myPaymentsService.deleteStripeSuscription(StripeSubscriptionId).subscribe((response: any) => {
      if (response) {
        if(response.status == 'canceled'){
          
        }
      }
    })
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
  getAllPaymants() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.myPaymentsService.getFilteredStripepayments(filterOptionModel).subscribe((response: any) => {
      if (response) {
        this.payments = response.body
      }
    })
  }
}

