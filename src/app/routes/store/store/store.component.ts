import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { JsonPipe } from '@angular/common';
import { ProductsService } from '../../products/products.service'
@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  newProduct = [];
  products = [];
  errorMessage = '';
  settingActive = 0;
  maxHeight = window.innerHeight;
  plans;
  productId;
  paymentmode;
  constructor(public router: Router, public productService: StoreService, public productsService: ProductsService) { }

  ngOnInit(): void {
    this.getAllProduct();
    //using to get list of plans
    // this.productService.getProducts().subscribe(
    //   products => {
    //     
    //     this.products = products;               
    //   },
    //   error => this.errorMessage = <any>error

    // );
  }
  public onClick(planid, paymentmode): any {
    debugger
    if (paymentmode == 'recurring') {
      this.router.navigate(['/checkoutsubscribe', planid, this.productId]);
    } else {
      this.router.navigate(['/checkout', planid, this.productId]);
    }


  }
  getAllPlans() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.productsService.getFilteredPlan(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.plans = response.body
        this.plans = this.plans.filter(x => x.productId == this.productId);
      }
    })
  }
  getAllProduct() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.productsService.getFilteredProduct(filterOptionModel).subscribe((response: any) => {
      if (response) {
        
        this.products = response.body
        if (this.products) {
          this.productId = this.products[0].id;
          this.getAllPlans();
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
  linkClick(index, productid) {
    
    this.settingActive = index;
    this.productId = this.productId = productid;
    this.productId = productid;
    this.getAllPlans();
  }
}
