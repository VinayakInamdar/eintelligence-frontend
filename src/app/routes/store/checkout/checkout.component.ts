import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { Router, ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { ProductsService } from '../../products/products.service'
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products = [];
  productsOld = [];
  plans = [];
  constructor(public campaignService: CampaignService, public openIdConnectService: OpenIdConnectService, public route: ActivatedRoute, public router: Router, public productService: StoreService, public productsService: ProductsService) { }
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  planid;
  productId;
  amount;
  userId;
  isShowDiv = false;
  campaignid = 100;
  stripe_session;
  priceId;
  sessionid;
  quantity = 1;
  paymentMode;
  paymentCycle;
  //
  campaignList: Campaign[];
  campaignDrp = '00000000-0000-0000-0000-000000000000';
  campaignError = false;
  stripePromise = loadStripe(environment.stripe_key);
  ngOnInit(): void {

    this.userId = '2e78a42a-af26-48bb-bda2-be9e16301435';
    this.getAllPlans();
    this.getCampaignList();
    this.planid = this.route.snapshot.paramMap.get('planid');
    this.productId = this.route.snapshot.paramMap.get('productid');
  }
  onChange(cid) {
    debugger
    this.campaignid = cid;
    this.campaignError = false;
  }
  public getCampaignList(): void {
    this.campaignService.getCampaign().subscribe(res => {

      this.campaignList = res;

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
  getAllPlans() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.productsService.getFilteredPlan(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.plans = response.body
        this.plans = this.plans.filter(x => x.id == this.planid);
        this.amount = this.plans[0].price;
        this.priceId = this.plans[0].priceId;
        this.paymentMode = this.plans[0].paymentType;
        this.paymentCycle = this.plans[0].paymentCycle;
      }
    })
  }
  makePayment() {
    debugger
    if (this.campaignDrp = '00000000-0000-0000-0000-000000000000') {
      this.campaignError = true;
    } else {
      this.campaignError = false;

      let data: []
      // Call your backend to create the Checkout session.
      this.productService.CreateStripePaymentCheckout(data).subscribe(
        products => {

          this.sessionid = products.sessionId
          this.checkout();
        },
        error => this.errorMessage = <any>error
      );

    }
  }
  async checkout() {

    this.campaignDrp;
    this.addToPaymentTable('sub_IfLOtHsAIYo2i3');
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: this.paymentMode,
      lineItems: [{ price: this.priceId, quantity: this.quantity }],
      successUrl: `https://localhost:4200/paymentsuccess`,
      cancelUrl: `https://localhost:4200/paymentfailure`,
    });

    this.addToPaymentTable('sdfsdfd');

    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }

  }
  addToPaymentTable(StripePaymentId) {

    let data = {
      amount: this.amount,
      userId: this.userId,
      planId: this.planid,
      paymentCycle: this.paymentCycle,
      campaignId: this.campaignid,//"00000000-0000-0000-0000-000000000000",//this.campaignid,
      PaymentMode: this.paymentMode,
      IsActive: true,
      StripePaymentId: StripePaymentId
    }
    this.productService.createStripePayment(data).subscribe(response => {
      if (response) {

        alert("Payent Done");
        // this.snackbarService.show('Days created successfully');
      }
    });
  }
}
