import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { JsonPipe } from '@angular/common';

@Component({
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.scss']
})
export class PaymentFailureComponent implements OnInit {

  products: IProduct[];
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  
  constructor(public router :Router, public productService : StoreService) { }

  ngOnInit(): void {

    //using to get list of plans
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;               
      },
      error => this.errorMessage = <any>error
      
    );
  }
  public onClick(planid,productid): any {
    this.router.navigate(['/checkout',productid,planid]);
  }

}
