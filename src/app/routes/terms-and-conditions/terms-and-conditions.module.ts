import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: TermsAndConditionsComponent },
];
@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class TermsAndConditionsModule { }
