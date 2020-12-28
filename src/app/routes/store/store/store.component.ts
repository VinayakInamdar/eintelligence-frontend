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
  newProduct=[];
  products= [];
  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  plans;
  productId;
  constructor(public router :Router, public productService : StoreService, public productsService : ProductsService) { }

  ngOnInit(): void {
this.getAllPlans();
this.getAllProduct();
    //using to get list of plans
    // this.productService.getProducts().subscribe(
    //   products => {
    //     debugger
    //     this.products = products;               
    //   },
    //   error => this.errorMessage = <any>error
      
    // );
  }
  public onClick(planid): any {
    debugger
    this.router.navigate(['/checkout',this.productId,planid]);
  }
  getAllPlans() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.productsService.getFilteredPlan(filterOptionModel).subscribe((response: any) => {
      if (response) {
        debugger
        this.plans =  response.body
      }
    })
  }
  getAllProduct() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.productsService.getFilteredProduct(filterOptionModel).subscribe((response: any) => {
      if (response) {
        debugger
        this.products =  response.body
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

}
