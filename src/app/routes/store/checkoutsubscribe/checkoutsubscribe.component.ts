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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { StripeService } from "ngx-stripe";
import { AccountService } from '../../account/account.service';
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
  shippingEmail: any;
  shippingName: any;
  shippingAddress: any;
  shippingPostalCode: any;
  shippingCity: any;
  shippingState: any;

  shippingAddressCountries = [];
  shippingCountries = [];
  shippingCountry: any; shipping = [];
  email = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  postalCode = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  state = new FormControl('', [Validators.required]);
  country = new FormControl('', [Validators.required]);
  valForm: FormGroup;
  //For stripe
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + environment.stripe_secreTkey
    })
  };
  cardEmail;
  card: StripeElement;
  stripeTest: FormGroup;
  clientSecret;
  //STripe end

  products = [];
  productsOld = [];
  plans = [];
  constructor(private http: HttpClient, public campaignService: CampaignService, public openIdConnectService: OpenIdConnectService,
    public route: ActivatedRoute, public router: Router, public productService: StoreService, private snackbarService: SnackbarService,
    public productsService: ProductsService, private accountService: AccountService, public fb: FormBuilder) {

    this.valForm = fb.group({

      'email': [this.email.value, Validators.required],
      'name': [this.name.value, Validators.required],
      'address': [this.address.value, Validators.required],
      'postalCode': [this.postalCode.value, Validators.required],
      'city': [this.city.value, Validators.required],
      'state': [this.state.value, Validators.required],
      'country': [this.country.value, Validators.required]
    })
  }
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  planid;
  productId;
  amount;
  userId;
  isShowDiv = false;
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
  campaignid = '00000000-0000-0000-0000-000000000000';
  campaignError = false;
  stripePromise = loadStripe(environment.stripe_key);
  companyDetail;
  ngOnInit(): void {
    this.userId = this.openIdConnectService.user.profile.sub;
    //this.userId = '2e78a42a-af26-48bb-bda2-be9e16301435';
    this.getUser();
    this.getAllPlans();
    this.getCampaignList();
    this.planid = this.route.snapshot.paramMap.get('planid');
    this.productId = this.route.snapshot.paramMap.get('productid');

    this.getShippingAddressLocations();
  }

  getUser() {

    var userId = this.openIdConnectService.user.profile.sub;
    // this.accountService.getUser(userId).subscribe(
    //   res1 => {
    //     console.log(res1);
    //     
    //   }
    // )
    const filterOptionModel = this.getFilterOptionPlans();
    this.accountService.getFilteredUsers(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.companyDetail = response.body
        this.companyDetail = this.companyDetail.filter(x => x.id == userId);
        this.companyDetail = this.companyDetail[0].company;
      }
    })
  }
  onChange(cid) {

    this.campaignid = cid;
    this.campaignError = false;
  }
  public getCampaignList(): void {
    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {

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

        this.stripeSubInit();

      }
    })
  }
  makePayment2() {

    const url = "https://api.stripe.com/v1/subscriptions";
    const body = new URLSearchParams();
    body.set('customer', 'cus_Ig2Fs0xb9PWEWr');
    body.set('items[0][price]', 'price_1I40gJEKoP0zJ89Qmal3ASze');

    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {


      }
    }, error => {

      alert(error.message);
    });
  }
  makePayment() {

    // if (this.campaignid = '00000000-0000-0000-0000-000000000000') {
    //   this.campaignError = true;
    // } else {
    //   this.campaignError = false;

    let data: []
    // Call your backend to create the CheckoutSubscribe session.
    this.productService.CreateStripePaymentCheckout(data).subscribe(
      products => {

        this.sessionid = products.sessionId

        this.checkout(this.sessionid);
      },
      error => this.errorMessage = <any>error
    );

    //}
  }
  async checkout(sessid) {

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

        window.location.href = 'https://www.google.com';
      });

    this.addToPaymentTable('sdfsdfd');

    // if (error) {
    //   console.log(error);
    // }

  }
  addToPaymentTable(StripeSubscriptionId) {
    ;
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
        ;
        this.loading(false);
        this.snackbarService.show('Checkout Done');
      }
    });
  }
  //For stripe Detroja
  //################StripeFuncation###################

  showError(errorMsgText) {

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

    this.loading(true);
    // const url = "https://api.stripe.com/v1/payment_methods";
    // const body = new URLSearchParams();
    // body.set('type', 'card');
    // body.set('card[number]', '4242424242424242');
    // body.set('card[exp_month]', '1');
    // body.set('card[exp_year]', '2023');
    // body.set('card[cvc]', '123');

    // this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
    //   if (res) {
    //     
    //     this.paymentMethodId = res['id'];
    //     this.createCustomer();
    //   }
    // }, error => {
    //   alert(error.message);
    // });
    this.campaignError = false;

    if (this.campaignid == '00000000-0000-0000-0000-000000000000') {
      this.campaignError = true;
      this.loading(false);
    }
    else {
      stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          //name: 'rubina123@gmail.com'//this.cardEmail
          name: this.shipping[0]
        }
      }).then((res) => {

        this.paymentMethodId = res.paymentMethod.id;
        this.createCustomer();
      });
    }
  }
  createSubscription() {
    ;
    const url = "https://api.stripe.com/v1/subscriptions";
    const body = new URLSearchParams();
    body.set('customer', this.customerId);
    body.set('items[0][price]', this.priceId);
    body.set('default_payment_method', this.paymentMethodId);

    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {

        this.subscriptionId = res['id'];
        this.downloadInvoice(res['latest_invoice'])
        this.addToPaymentTable(this.subscriptionId);
      }
    }, error => {
      this.loading(false);

      this.snackbarService.show('Checkout Failed For Subscription: ' + JSON.stringify(error.error));
    });

  }
  createCustomer() {
    ;
    const url = "https://api.stripe.com/v1/customers";
    const body = new URLSearchParams();
    body.set('description', this.shipping[1]);
    body.set('address[line1]', this.shipping[2]);
    body.set('address[city]', this.shipping[4]);
    body.set('address[country]', this.shipping[6]);
    body.set('address[postal_code]', this.shipping[3]);
    body.set('address[state]', this.shipping[5]);
    body.set('email', this.shipping[0]);
    body.set('name', this.shipping[1]);

    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {

        this.customerId = res['id'];
        this.attachCustomerWithPaymentMethod();
      }
    }, error => {
      this.loading(false);

      this.snackbarService.show('Checkout Failed  For Create Customer: ' + JSON.stringify(error.error));
    });
  }
  attachCustomerWithPaymentMethod() {

    const url = "https://api.stripe.com/v1/payment_methods/" + this.paymentMethodId + "/attach";
    const body = new URLSearchParams();
    body.set('customer', this.customerId);

    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {

        this.createSubscription();
      }
    }, error => {
      this.loading(false);
      this.snackbarService.show('Checkout Failed  For Attach Payment Method: ' + JSON.stringify(error.error));
    });

  }
  public downloadInvoice(invoiceId): any {
    const url = "https://api.stripe.com/v1/invoices/" + invoiceId;
    this.http.get(url, this.httpOptionJSON).subscribe(res => {
      if (res) {

        //download invoice
        this.download(res['invoice_pdf'])
      }
    }, error => {
      this.snackbarService.show('Download Invoice Failed : ' + JSON.stringify(error.error));
    });
  }
  //For stripe Detroja End
  public download(downloadUrl: string): void {

    window.open(downloadUrl, '_blank');
  }

  getShippingAddressLocations() {
    ;
    const url = "https://api.stripe.com/v1/country_specs?limit=100";
    this.http.get(url, this.httpOptionJSON).subscribe((res) => {
      ;
      this.shippingAddressCountries = res['data'];
      this.shippingCountries = res['data'];
    })
  }
  setSelectedLocation(event: any) {
    ;
    this.shipping[6] = event.value;
    this.shippingCountry = event.value;
  }
  onKey(value) {
    ;
    if (value === '' || value == null || value == undefined) {
      this.shippingAddressCountries = this.shippingCountries;
    }
    else {
      this.shippingAddressCountries = this.search(value);
    }
  }
  search(value: string) {
    ;
    let filter = value.toLowerCase();
    return this.shippingAddressCountries.filter(option => option.id.toLowerCase().startsWith(filter));
  }
  submitForm(value: any) {
    ;
    this.shippingEmail = value.email;
    this.shippingName = value.name;
    this.shippingAddress = value.address;
    this.shippingPostalCode = value.postalCode;
    this.shippingCity = value.city;
    this.shippingState = value.state;
    this.shippingCountry = value.country;
    this.shipping = [
      this.shippingEmail,
      this.shippingName,
      this.shippingAddress,
      this.shippingPostalCode,
      this.shippingCity,
      this.shippingState,
      this.shippingCountry
    ]
  }
}
