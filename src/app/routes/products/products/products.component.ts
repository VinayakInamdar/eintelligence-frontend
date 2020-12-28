import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ProductsService } from '../products.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
//import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
declare var $: any;
const success = require('sweetalert');

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  settingActive: number = 1;
  oneAtATime: boolean = true;
  //for product
  name = new FormControl(null, [Validators.required]);
  description = new FormControl(null, [Validators.required]);
  productForm = new FormGroup({
    name: this.name,
    description: this.description,
  })
  //for plan
  planName = new FormControl(null, [Validators.required]);
  planSubTitle = new FormControl(null, [Validators.required]);
  features = new FormControl(null, [Validators.required]);
  price = new FormControl(null, [Validators.required]);
  recommendedAgencyPrice = new FormControl(null, [Validators.required]);
  paymentCycle = new FormControl(null, [Validators.required]);
  paymentType = new FormControl(null, [Validators.required]);
  currency = new FormControl(null, [Validators.required]);

  planForm = new FormGroup({
    planName: this.planName,
    planSubTitle: this.planSubTitle,
    features: this.features,
    price: this.price,
    recommendedAgencyPrice: this.recommendedAgencyPrice,
    paymentCycle: this.paymentCycle,
    paymentType: this.paymentType,
    currency: this.currency,
  })
  productId;
  stripeProductId;
  priceid;
  companyId;
  planId;
  planList = [];

  productList = [];
  settings = {
    actions: { add: false, edit: false, delete: false },
    columns: {
      name: {
        title: '',
        filter: false
      }
    }
  };
  settingsPlan = {
    actions: { add: false, edit: false, delete: false },
    columns: {
      name: {
        title: 'Name',
        filter: false
      },
      subtitle: {
        title: 'Subtitle',
        filter: false
      },
      price: {
        title: 'Price',
        filter: false
      },
      recommendedAgencyPrice: {
        title: 'Agency Price',
        filter: false
      },
      currency: {
        title: 'Currency',
        filter: false
      },
      paymentType: {
        title: 'Payment Type',
        filter: false
      },
      paymentCycle: {
        title: 'Payment Cycle',
        filter: false
      }
    }
  };
  source: LocalDataSource;
  sourcePlan: LocalDataSource;
  constructor(private productService: ProductsService, private translate: TranslateService, private http: HttpClient
    //private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.companyId = localStorage.getItem('companyID');
    this.getProductsList();
  }
  getProductsList() {
    this.productService.getProductsByCompanyId(this.companyId).subscribe((response: any) => {
      if (response) {
        this.productList = response;
        this.source = new LocalDataSource(this.productList)
        this.planForm.reset();
      }
    })
  }
  getPlan(planId) {
    this.planForm.reset();
    this.productService.getPlan(planId).subscribe((response: any) => {
      if (response) {
        debugger
        this.planId = response.id;
        this.stripeProductId = response.stripeProductId;
        this.planForm.patchValue({
          planName: response.name,
          planSubTitle: response.subtitle,
          features: response.features,
          price: response.price,
          recommendedAgencyPrice: response.recommendedAgencyPrice,
          paymentCycle: response.paymentCycle,
          paymentType: response.paymentType,
          currency: response.currency,
        })
      }
    })
  }
  getPlansList() {
    this.productService.getPlansByProductId(this.productId).subscribe((response: any) => {
      if (response) {
        this.planList = response;
        this.sourcePlan = new LocalDataSource(this.planList)
      }
    })
  }

  addProduct() {

    if (this.productId == undefined || this.productId == null) {
      let data = {
        id: "00000000-0000-0000-0000-000000000000",
        name: this.name.value,
        description: this.description.value,
        companyID: this.companyId

      }
      this.productService.createProducts(data).subscribe(response => {
        if (response) {

          this.successAlert();
          this.getProductsList();
        }
      });
    } else {
      let data = {
        id: this.productId,
        name: this.name.value,
        description: this.description.value,
        companyID: this.companyId
      }
      this.productService.updateProducts(this.productId, data).subscribe(response => {
        //if (response) {
        this.successAlert();
        this.getProductsList();
        //this.snackbarService.show('Days created successfully');
        //}
      });
    }
  }
  addPlan() {
    debugger
    if (this.planId == undefined || this.planId == null) {
      let data = {
        id: "00000000-0000-0000-0000-000000000000",
        name: this.name.value,
        subTitle: this.planSubTitle.value,
        features: this.features.value,
        price: this.price.value,
        recommendedAgencyPrice: this.recommendedAgencyPrice.value,
        paymentCycle: this.paymentCycle.value,
        paymentType: this.paymentType.value,
        currency: this.currency.value,
        productId: this.productId,
        stripeProductId:this.stripeProductId,
        priceId:this.priceid,
      }
      this.productService.createPlan(data).subscribe(response => {
        if (response) {
          this.successAlert();
          this.getPlansList();
          this.planForm.reset();
        }
      });
    } else {
      let data = {
        id: this.planId,
        name: this.name.value,
        subTitle: this.planSubTitle.value,
        features: this.features.value,
        price: this.price.value,
        recommendedAgencyPrice: this.recommendedAgencyPrice.value,
        paymentCycle: this.paymentCycle.value,
        paymentType: this.paymentType.value,
        currency: this.currency.value,
        productId: this.productId,
      }
      this.productService.updatePlan(this.planId, data).subscribe(response => {
        this.successAlert();
        this.getPlansList();
        this.planForm.reset();
      });
    }
  }
  userRowSelect(product: any): void {
    this.getProduct(product.data.id);
  }
  userRowSelectPlan(plan: any): void {
    this.getPlan(plan.data.id);
  }
  deleteProduct() {
    this.productService.deleteProducts(this.productId).subscribe((response: any) => {
      this.planForm.reset();
      this.productForm.reset();
      this.getProductsList();
    })
  }
  deletePlan() {
    this.productService.deletePlan(this.planId).subscribe((response: any) => {
      this.planForm.reset();
      this.getPlansList();
    })
  }
  getProduct(productId) {
    this.productForm.reset();
    this.planForm.reset();
    this.productService.getProduct(productId).subscribe((response: any) => {
      if (response) {
        this.productId = response.id;
        this.productForm.patchValue({
          name: response.name,
          description: response.description,
          companyID: response.companyID
        });
        this.getPlansList();
      }
    })
  }
  successAlert() {
    success({
      icon: this.translate.instant('sweetalert.SUCCESSICON'),
      title: this.translate.instant('message.UPDATEMSG'),
      buttons: {
        confirm: {
          text: this.translate.instant('sweetalert.OKBUTTON'),
          value: true,
          visible: true,
          className: "bg-primary",
          closeModal: true,
        }
      }
    }).then((isConfirm: any) => {
      if (isConfirm) {
        // this.router.navigate(['/home']);
      }
    });
  }
  createProductOnStripe() {
    this.productService.createProductOnStripe(this.name.value,this.description.value).subscribe((response: any) => {
      if (response) {
        debugger
        this.stripeProductId = response.id;
        this.addProduct();
      
      }
    })
  }
  createStripePrice() {
    var dict = []; 
    dict.push({
        key:   'UnitAmount',
        value: 'this.price.value'
    });
    var dictionary = new Array(); 
    dictionary['key'] = 'value'
    let data={
				UnitAmount : this.price.value,
        Currency : this.currency.value,
        Recurring :
        {
          Interval : this.paymentCycle.value,
        },
        ProductId : this.stripeProductId,//"prod_IdaudQUPYxm2BV",
        Product: this.stripeProductId,
        Type:this.paymentType.value,
			};
    debugger
    this.productService.createStripePrice(dictionary).subscribe((response: any) => {
      if (response) {
       this.addPlan();
      }
    })
  }
}


