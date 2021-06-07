import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxStripeModule } from 'ngx-stripe';
const routes: Routes = [
  { path: '', component: ProductsComponent }
];

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    NgxSelectModule,
    NgxIntlTelInputModule,
    AccordionModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_51I0iLaEKoP0zJ89QGXq8ihvypBEzyryF6Y5Hiro0UDcPLQeCTzA0v8S6lYv2DNBZZS3LxICWKJATbOxzdUCOl73p00Her3EA2b'),
    
  ],
 
  exports: [
    RouterModule,
],
})
export class ProductsModule { }
