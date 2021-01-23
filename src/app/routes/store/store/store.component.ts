import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { JsonPipe } from '@angular/common';
import { ProductsService } from '../../products/products.service'
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { AccountService } from '../../account/account.service';
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
  userId;
  companyId;
  constructor(public router: Router, private accountService: AccountService, public openIdConnectService: OpenIdConnectService, public productService: StoreService, public productsService: ProductsService) { }

  ngOnInit(): void {
    
    this.companyId = localStorage.getItem('companyID');
    this.userId = this.openIdConnectService.user.profile.sub;
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
        if (this.products != undefined && this.products != null && this.products.length > 0) {
        this.products = this.products.filter(x => x.companyId == this.companyId);
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
