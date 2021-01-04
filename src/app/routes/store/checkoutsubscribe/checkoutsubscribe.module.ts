import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutSubscribeComponent } from './checkoutsubscribe.component';

const routes: Routes = [

  { path: '', component: CheckoutSubscribeComponent }
];


@NgModule({
  declarations: [CheckoutSubscribeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
]
})
export class CheckoutSubscribeModule { }
