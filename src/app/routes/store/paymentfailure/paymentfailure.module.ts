import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentFailureComponent } from './paymentfailure.component';

const routes: Routes = [

  { path: '', component: PaymentFailureComponent }
];


@NgModule({
  declarations: [PaymentFailureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
]
})
export class PaymentFailureModule { }
