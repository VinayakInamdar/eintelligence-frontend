import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { JsonPipe } from '@angular/common';
import { ProductsService } from '../../products/products.service'
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { AccountService } from '../../account/account.service';
import { SettingsService } from '../../../core/settings/settings.service';
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
  queryParam;
  constructor(public router: Router,
    private accountService: AccountService,
    public openIdConnectService: OpenIdConnectService,
    public productService: StoreService,
    public productsService: ProductsService,
    public settingService: SettingsService,
    private actr: ActivatedRoute) { }

  ngOnInit(): void {
    this.plans = [];
    this.companyId = this.settingService.selectedCompanyInfo.companyId;
    this.userId = this.openIdConnectService.user.profile.sub;

    this.actr.data.subscribe((res) => {
      if (res.resolvedData != null) {
        this.plans = res.resolvedData;
      }
    })

    // if (this.actr.snapshot.paramMap.get('id') == "ALL") {
    //   this.queryParam = this.actr.snapshot.paramMap.get('id');
    //   this.getAllPlans();
    // }
    // else {
    //   this.productId = this.actr.snapshot.paramMap.get('id');
    //   this.getAllPlansByProductId();
    // }

    //this.getAllProduct();
    //using to get list of plans
    // this.productService.getProducts().subscribe(
    //   products => {
    //     
    //     this.products = products;               
    //   },
    //   error => this.errorMessage = <any>error

    // );
  }
  public onClick(plan): any {
    debugger
    if (plan.paymentType == 'recurring') {
      this.router.navigate(['/checkoutsubscribe', plan.id, plan.productId]);
    } else {
      this.router.navigate(['/checkout', plan.id, plan.productId]);
    }


  }

  getAllPlans() {
    this.productsService.getAllPlanByCompanyId(this.companyId).subscribe((response: any) => {
      if (response) {
        this.plans = response
        // this.plans = this.plans.filter(x => x.productId == this.productId);
      }
    })
  }
  getAllPlansByProductId() {
    const filterOptionModel = this.getFilterOptionPlans();
    this.productsService.getFilteredPlan(filterOptionModel).subscribe((response: any) => {
      if (response) {

        this.plans = response.body
        // this.plans = this.plans.filter(x => x.productId == this.productId);
      }
    })
  }
  getAllProduct() {
    const filterOptionModel = this.getFilterOptionProduct();
    this.productsService.getFilteredProduct(filterOptionModel).subscribe((response: any) => {
      if (response) {
        this.products = response.body
        if (this.products != undefined && this.products != null && this.products.length > 0) {
          // this.products = this.products.filter(x => x.companyID == this.companyId);
          this.productId = this.products[0].id;
          this.getAllPlans();
        }
      }
    })
  }
  private getFilterOptionProduct() {
    return {
      pageNumber: 1,
      pageSize: 1000,
      fields: '',
      searchQuery: 'CompanyID==\"' + this.companyId + '\"',
      orderBy: ''
    }
  }
  private getFilterOptionPlans() {
    return {
      pageNumber: 1,
      pageSize: 1000,
      fields: '',
      searchQuery: 'ProductId==\"' + this.productId + '\"',
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
