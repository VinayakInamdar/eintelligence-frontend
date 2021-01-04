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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  StripeElement
} from '@stripe/stripe-js';
declare var Stripe;
@Component({
  selector: 'app-checkoutsubscribe',
  templateUrl: './checkoutsubscribe.component.html',
  styleUrls: ['./checkoutsubscribe.component.scss']
})
export class CheckoutSubscribeComponent implements OnInit {
  //For stripe
  isShow = false;
  isShowSubscription = true;
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+environment.stripe_secreTkey
    })
  };
  cardObject: any = {
    email: '',
    billingName: '',
    billingCountry: '',
  }
  card: StripeElement;
  stripeTest: FormGroup;
  clientSecret;
  //STripe end

  products = [];
  productsOld = [];
  plans = [];
  constructor(private http: HttpClient, public campaignService: CampaignService, public openIdConnectService: OpenIdConnectService, 
    public route: ActivatedRoute, public router: Router, public productService: StoreService, 
    public productsService: ProductsService) { }
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  planid;
  productId;
  amount;
  userId;
  isShowDiv = false;
  campaignid;
  stripe_session;
  priceId;
  sessionid;
  quantity = 1;
  paymentMode;
  paymentCycle;
  customerId;
  subscriptionId;
  paymentMethodId;
  //
  campaignList: Campaign[];
  campaignDrp = '00000000-0000-0000-0000-000000000000';
  campaignError = false;
  stripePromise = loadStripe(environment.stripe_key);
  ngOnInit(): void {
    this.isShow = false;
    this.isShowSubscription = false;
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
        debugger
        this.plans = response.body
        this.plans = this.plans.filter(x => x.id == this.planid);
        this.amount = this.plans[0].price;
        this.priceId = this.plans[0].priceId;
        this.paymentMode = this.plans[0].paymentType;
        this.paymentCycle = this.plans[0].paymentCycle;
          this.isShow = true;
          this.stripeSubInit();
        
      }
    })
  }
  makePayment2() {
    debugger
    const url = "https://api.stripe.com/v1/subscriptions";
    const body = new URLSearchParams();
    body.set('customer', 'cus_Ig2Fs0xb9PWEWr');
    body.set('items[0][price]', 'price_1I40gJEKoP0zJ89Qmal3ASze');

    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {
        debugger

      }
    }, error => {
      alert(error.message);
    });
  }
  makePayment() {
    debugger
    // if (this.campaignid = '00000000-0000-0000-0000-000000000000') {
    //   this.campaignError = true;
    // } else {
    //   this.campaignError = false;

    let data: []
    // Call your backend to create the CheckoutSubscribe session.
    this.productService.CreateStripePaymentCheckout(data).subscribe(
      products => {
        debugger
        this.sessionid = products.sessionId

        this.checkout(this.sessionid);
      },
      error => this.errorMessage = <any>error
    );

    //}
  }
  async checkout(sessid) {
   this.campaignDrp;
    //this.addToPaymentTable('sub_IfLOtHsAIYo2i3');
    // When the customer clicks on the button, redirect them to CheckoutSubscribe.
    const stripe = await this.stripePromise;
    await stripe.redirectToCheckout({
      mode: this.paymentMode,
      lineItems: [{ price: this.priceId, quantity: this.quantity }],
      successUrl: `https://localhost:4200/paymentsuccess?sessionid=` + sessid,
      cancelUrl: `https://localhost:4200/paymentfailure`,
    }).then((response) => response)
      .then((data) => {
        debugger
        window.location.href = 'https://www.google.com';
      });

    this.addToPaymentTable('sdfsdfd');

    // if (error) {
    //   console.log(error);
    // }

  }
  addToPaymentTable(StripeSubscriptionId) {
    let data = {
      amount: this.amount,
      userId: this.userId,
      planId: this.planid,
      paymentCycle: this.paymentCycle,
      campaignId: this.campaignid,//"00000000-0000-0000-0000-000000000000",//this.campaignid,
      PaymentMode: this.paymentMode,
      IsActive: true,
      StripePaymentId: StripeSubscriptionId,//add id payment
      StripeSubscriptionId: StripeSubscriptionId
    }
    this.productService.createStripePayment(data).subscribe(response => {
      if (response) {
        alert("Payent Done");
      }
    });
  }
  //For stripe Detroja
  //################StripeFuncation###################
  stripeInit() {
    var stripe = Stripe(environment.stripe_key);
    //document.querySelector("#submit")['disabled'] = true;
    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    var card = elements.create("card", { style: style });

    this.paymentIntentCall();

    // Stripe injects an iframe into the DOM
    card.mount("#card-element");

    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("#submit")['disabled'] = event.empty;
      document.querySelector("#card-errors").textContent = event.error ? event.error.message : "";
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      // Complete payment when the submit button is clicked
      this.payWithCard(stripe, card, this.clientSecret);
    });
  }
  paymentIntentCall() {
    const url = "https://api.stripe.com/v1/payment_intents";
    const body = new URLSearchParams();
    body.set('amount', '500');
    body.set('currency', 'inr');
    body.set('payment_method_types[]', 'card');

    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {
        debugger
        this.paymentMethodId = res['id'];
      }
    }, error => {
      alert(error.message);
    });
  }
  payWithCard(stripe, card, clientSecret) {
    debugger
    this.loading(true);
    const url = "https://api.stripe.com/v1/payment_intents/" + clientSecret + "/confirm";
    const body = new URLSearchParams();
    body.set('payment_method', 'pm_card_visa');
    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {
        debugger
        this.loading(false);
        this.clientSecret = res['client_secret'];
        this.addToPaymentTable(res['id']);
      }
    }, error => {
      alert(error.message);
    });
  }
  orderComplete(paymentIntentId) {
    debugger
    this.loading(false);
    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("#submit")['disabled'] = true;
  }
  showError(errorMsgText) {
    debugger
    this.loading(false);
    var errorMsg = document.querySelector("#card-errors");
    errorMsg.textContent = errorMsgText;
    setTimeout(() => {
      errorMsg.textContent = "";
    }, 4000);
  }
  loading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("#submit")['disabled'] = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("#submit")['disabled'] = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  }
    //################StripeSubscriptionFuncation##########
    stripeSubInit() {
      var stripe = Stripe(environment.stripe_key);
      document.querySelector("#submit")['disabled'] = true;
      var elements = stripe.elements();
      var style = {
        base: {
          color: "#32325d",
          fontFamily: 'Arial, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#32325d"
          }
        },
        invalid: {
          fontFamily: 'Arial, sans-serif',
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };
      var card = elements.create("card", { style: style });
      // Stripe injects an iframe into the DOM
      card.mount("#card-element");
  
      card.on("change", function (event) {
        // Disable the Pay button if there are no card details in the Element
        document.querySelector("#submit")['disabled'] = event.empty;
        document.querySelector("#card-errors").textContent = event.error ? event.error.message : "";
      });
  
      var form = document.getElementById("subscription-form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Complete payment when the submit button is clicked
        this.createPaymentMethod(stripe, card);
      });
    }
    createPaymentMethod(stripe, cardElement) {
      debugger
  
      // const url = "https://api.stripe.com/v1/payment_methods";
      // const body = new URLSearchParams();
      // body.set('type', 'card');
      // body.set('card[number]', '4242424242424242');
      // body.set('card[exp_month]', '1');
      // body.set('card[exp_year]', '2023');
      // body.set('card[cvc]', '123');
  
      // this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      //   if (res) {
      //     debugger
      //     this.paymentMethodId = res['id'];
      //     this.createCustomer();
      //   }
      // }, error => {
      //   alert(error.message);
      // });
      let p = this.cardObject.email;
      stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
        // billing_details: {
        //   name: 'rubin123@yahoo.com,'//this.cardObject.email,
        // }
      }).then((res) => {
        debugger
        this.paymentMethodId = res.paymentMethod.id;
        this.createCustomer();
      });
    }
    createSubscription() {
      debugger
      const url = "https://api.stripe.com/v1/subscriptions";
      const body = new URLSearchParams();
      body.set('customer', this.customerId);
      body.set('items[0][price]', this.priceId);
      body.set('default_payment_method', this.paymentMethodId);
  
      this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
        if (res) {
          debugger
          this.subscriptionId = res['id'];
          this.addToPaymentTable(this.subscriptionId);
        }
      }, error => {
        alert(error.message);
      });
  
    }
    createCustomer() {
      debugger
      const url = "https://api.stripe.com/v1/customers";
      const body = new URLSearchParams();
      body.set('description', "rubina@gmail.com");
  
      this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
        if (res) {
          debugger
          this.customerId = res['id'];
          this.attachCustomerWithPaymentMethod();
        }
      }, error => {
        alert(error.message);
      });
    }
    attachCustomerWithPaymentMethod() {
      debugger
      const url = "https://api.stripe.com/v1/payment_methods/" + this.paymentMethodId + "/attach";
      const body = new URLSearchParams();
      body.set('customer', this.customerId);
  
      this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
        if (res) {
          debugger
          this.createSubscription();
        }
      }, error => {
        alert(error.message);
      });
  
    }
  //For stripe Detroja End

}
