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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  StripeElement
} from '@stripe/stripe-js';
declare var Stripe;
const success = require('sweetalert');

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  shippingEmail: any; shippingName: any; shippingAddress: any; shippingPostalCode: any;
  shippingCity: any; shippingState: any; shippingCountry: any; shipping = [];
  shippingAddressCountries = []; shippingCountries = [];
  email = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  postalCode = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  state = new FormControl('', [Validators.required]);
  country = new FormControl('', [Validators.required]);
  valForm: FormGroup;
  value: any;
  //For stripe
  httpOptionJSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + environment.stripe_secreTkey
    })
  };
  cardemail;
  card: StripeElement;
  stripeTest: FormGroup;
  clientSecret;
  //STripe end

  products = [];
  productsOld = [];
  plans = [];
  constructor(private http: HttpClient, public campaignService: CampaignService,
    private openIdConnectService: OpenIdConnectService, public route: ActivatedRoute,
    public router: Router, public productService: StoreService, public productsService: ProductsService,
    private snackbarService: SnackbarService, public fb: FormBuilder) {

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
  currency;

  ngOnInit(): void {

    this.userId = localStorage.getItem("userID");
    //this.userId = '2e78a42a-af26-48bb-bda2-be9e16301435';
    this.getAllPlans();
    this.getCampaignList();
    this.planid = this.route.snapshot.paramMap.get('planid');
    this.productId = this.route.snapshot.paramMap.get('productid');
    ;
    this.getShippingAddressLocations();
  }
  onChange(cid) {

    this.campaignid = cid;
    this.campaignError = false;
  }
  public getCampaignList(): void {
    var userid = localStorage.getItem("userID");
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
        this.currency = this.plans[0].currency
        this.stripeInit();
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
    // Call your backend to create the Checkout session.
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
    // const stripe = this.stripePromise;
    // (await stripe).redirectToCheckout({sessionId:  products.sessionId})
    // .then(res => {
    //   
    //    console.log(res);
    // })
    // .catch(error => {
    //   
    //    console.log(error);
    // });
    //this.addToPaymentTable('sub_IfLOtHsAIYo2i3');
    // When the customer clicks on the button, redirect them to Checkout.
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
        this.snackbarService.show('Checkout Done');
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
    body.set('amount', this.amount);
    body.set('currency', this.currency);
    body.set('description', 'Software development services');
    body.set('payment_method_types[]', 'card');
    this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
      if (res) {

        this.clientSecret = res['id'];
        this.paymentMethodId = res['id'];
      }
    }, error => {
      this.loading(false);
      this.snackbarService.show('Checkout Failed For paymentIntentCall : ' + JSON.stringify(error.error));

    });
  }
  payWithCard(stripe, card, clientSecret) {
    ;
    this.campaignError = false;
    var form = document.getElementById("payment-form");


    if (this.campaignid == '00000000-0000-0000-0000-000000000000') {
      this.campaignError = true;
    }
    // else
    // if (this.cardemail == '' || this.cardemail == undefined) {
    //   this.snackbarService.show('Please Enter valid Email Id');
    // }
    else {

      this.loading(true);
      const url = "https://api.stripe.com/v1/payment_intents/" + clientSecret + "/confirm";
      let params: any = new HttpParams();

      // Begin assigning parameters
      // params = params.append('payment_method', 'pm_card_visa');
      // params = params.append('receipt_email', 'rubina_lakdawala@yahoo.com');

      // params = params.append('shipping[name]', 'Rubaina Lakdawala');
      // params = params.append('shipping[address][line1]', 'Lakdawala STreet');
      // params = params.append('shipping[address][postal_code]', '392001');
      // params = params.append('shipping[address][city]', 'Bharuch');
      // params = params.append('shipping[address][state]', 'Gujarat');
      // params = params.append('shipping[address][country]', 'India');
      // params = params.append('description', 'sdsad');
      // params = params.append('currency', this.currency);
      // params = params.append('payment_method_types[]', 'card');

      // https://localhost:4200/checkout/1a0cece8-1171-41ab-c4f7-08d924dd8f86/c0039b84-d226-4da2-7fc4-08d924ddd4a0
      ;
      
      const body = new URLSearchParams();
      body.set('payment_method', 'pm_card_visa');
      body.set('receipt_email', this.shipping[0]);
      body.set('shipping[name]', this.shipping[1]);
      body.set('shipping[address][line1]', this.shipping[2]);
      body.set('shipping[address][postal_code]', this.shipping[3]);
      body.set('shipping[address][city]', this.shipping[4]);
      body.set('shipping[address][state]', this.shipping[5]);
      body.set('shipping[address][country]', this.shipping[6]);

      this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
        if (res) {

          this.loading(false);
          this.clientSecret = res['client_secret'];
          this.snackbarService.show('Checkout Done');

        }
      }, error => {

        this.loading(false);
        this.snackbarService.show('Checkout Failed  For Pay With Card : ' + JSON.stringify(error.error));
      });
    }
  }
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


  //For stripe Detroja End
 
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
 
  //for getting shipping locations
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
    this.shipping[6]=event.value;
    this.shippingCountry=event.value;
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
}
