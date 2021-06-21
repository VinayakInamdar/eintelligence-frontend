import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyPaymentsComponent } from './mypayments.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

const routes: Routes = [

  { path: '', component: MyPaymentsComponent }
];


@NgModule({
  declarations: [MyPaymentsComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
]
})
export class MyPaymentsModule { }
