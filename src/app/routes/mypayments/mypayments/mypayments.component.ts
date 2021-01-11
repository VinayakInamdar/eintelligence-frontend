import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { MyPaymentsService } from '../../mypayments/mypayments.service'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StoreService } from '../../store/store.service';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';

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
  priceId;
  sessionid;
  quantity = 1;
  planid;
  productId;
  amount;
  userId;
  paymentMode;
  paymentCycle;
  campaignid;
  tempPlansList;
  stripePaymentId;
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+environment.stripe_secreTkey
    })
  };
  constructor(public router: Router,public openIdConnectService: OpenIdConnectService, public myPaymentsService: MyPaymentsService, private http: HttpClient,
    public storeService: StoreService) { }

  ngOnInit(): void {
    this.userId = this.openIdConnectService.user.profile.sub;
   // this.userId = '2e78a42a-af26-48bb-bda2-be9e16301435';
    this.getAllPaymants();
  }

  public cancleSubscription(StripeSubscriptionId): any {


    const url = "https://api.stripe.com/v1/subscriptions/" +StripeSubscriptionId;
    this.http.delete(url, this.httpOptionJSON).subscribe(res => {
      if (res) {
        
        let temp = this.tempPlansList.filter(x => x.stripeSubscriptionId == StripeSubscriptionId);
        if(temp!= undefined){
        this.amount = temp[0].amount;
        this.paymentCycle = temp[0].paymentCycle;
        this.planid = temp[0].planId;
        this.campaignid=temp[0].campaignId;
        this.stripePaymentId = temp[0].id;
        this.paymentMode = temp[0].plan.paymentType;
        this.addToPaymentTable(StripeSubscriptionId);
        }
      }
    }, error => {
      alert(error.message);
    });
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
  addToPaymentTable(StripeSubscriptionId) {
    
    let data = {
      id : this.stripePaymentId,
      amount: this.amount,
      userId: this.userId,
      planId: this.planid,
      paymentCycle: this.paymentCycle,
      campaignId: this.campaignid,//"00000000-0000-0000-0000-000000000000",//this.campaignid,
      PaymentMode: this.paymentMode,
      IsActive: false,
      StripePaymentId: StripeSubscriptionId,//add id payment
      StripeSubscriptionId: StripeSubscriptionId
    }
    this.storeService.updateStripePayment(this.stripePaymentId,data).subscribe(response => {
      if (response) {
        
        alert("Payent Done");
      }
    });
  }
  getAllPaymants() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.myPaymentsService.getFilteredStripepayments(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.payments = response.body;
        this.tempPlansList = this.payments;

      }
    })
  }
}

