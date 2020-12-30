import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyPaymentsComponent } from './mypayments.component';

const routes: Routes = [

  { path: '', component: MyPaymentsComponent }
];


@NgModule({
  declarations: [MyPaymentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
]
})
export class MyPaymentsModule { }
