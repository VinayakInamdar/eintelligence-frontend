import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products=[];
  productsOld=[];
  plans:[];
  constructor(public route :ActivatedRoute,public router :Router,public productService: StoreService) { }
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  planid;
  productId=1;
  amount;
  userId;
  ngOnInit(): void {
    this.planid = this.route.snapshot.paramMap.get('id');
    this.productService.getProducts().subscribe(
      products => {
        debugger
        this.productsOld = products;
        this.products =  this.productsOld.filter(x => x.id == this.planid);
        
        // this.products =  this.productsOld.filter(x => x.plans.planId == this.planid);
        this.plans = this.products[0].plans;
      //  this.products = [...this.products];
      },
      error => this.errorMessage = <any>error
    );
  }
  makePayment(){
    debugger
    let data = {
      productId : this.productId,
      amount :  this.amount,
      userId : this.userId,
      planId : this.planid,
      paymentCycle: 'monthly'
    }
    this.productService.createStripePayment(data).subscribe(response => {
      debugger
      if (response) {
        debugger
        alert("Payent DOne");
       // this.snackbarService.show('Days created successfully');
      }
    });
  }
}
