import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PrivacypolicyComponent },
];

@NgModule({
  declarations: [PrivacypolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class PrivacypolicyModule { }
