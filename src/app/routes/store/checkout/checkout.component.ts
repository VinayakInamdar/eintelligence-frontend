import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { Router,ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { ProductsService } from '../../products/products.service'
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products=[];
  productsOld=[];
  plans=[];
  constructor(public route :ActivatedRoute,public router :Router,public productService: StoreService, public productsService : ProductsService) { }
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  planid;
  productId;
  amount;
  userId;
  isShowDiv = false;
  campaignid=100;
  stripe_session;
  title = "angular-stripe";
  priceId = "price_1I1UGIEKoP0zJ89QtQ6YFU82";//price_1I1Tt7EKoP0zJ89QLssTwRXe
  sessionid;
  quantity = 1;
  stripePromise = loadStripe(environment.stripe_key);
  ngOnInit(): void {
    debugger
    this.getAllPlans();
    this.planid = this.route.snapshot.paramMap.get('planid');
    this.productId = this.route.snapshot.paramMap.get('productid');
    // this.productService.getProducts().subscribe(
    //   products => {
        
    //     this.productsOld = products;
    //     let pro = this.productsOld.filter(x => x.id == this.productId );
    //     let plan = pro[0].plans;
    //     this.plans = plan.filter(x => x.planId == this.planid );
    //     this.amount = this.plans[0].price;
    //   },
    //   error => this.errorMessage = <any>error
    // );
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
        this.plans =  response.body
        this.plans = this.plans.filter(x => x.id == this.planid );
        this.amount = this.plans[0].price;
      }
    })
  }
  makePayment(){
    
    let data:[]
    // Call your backend to create the Checkout session.
    this.productService.CreateStripePaymentCheckout(data).subscribe(
      products => {
        
        this.sessionid = products.sessionId
        this.checkout();
      },
      error => this.errorMessage = <any>error
    );
  }
  async checkout() {
    
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: 'subscription',//'payment',
      lineItems: [{ price: this.priceId, quantity: this.quantity }],
      successUrl: `https://localhost:4200/paymentsuccess`,
      cancelUrl: `https://localhost:4200/paymentfailure`,
    });
    //this.addToPaymentTable();
    
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }

  }
  addToPaymentTable(){
    
    let data = {
      productId : this.productId,
      amount :  this.amount,
      userId : this.userId,
      planId : this.planid,
      paymentCycle: 'monthly',
      campaignId :this.campaignid
    }
    this.productService.createStripePayment(data).subscribe(response => {
      
      if (response) {
        
        alert("Payent Done");
       // this.snackbarService.show('Days created successfully');
      }
    });
  }
}
