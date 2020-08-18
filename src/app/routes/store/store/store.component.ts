import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { JsonPipe } from '@angular/common';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

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

}
