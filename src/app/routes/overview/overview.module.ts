import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { KeywordsComponent } from '../keywords/keywords/keywords.component';

// const routes: Routes = [
//   { path: 'keywords', component: KeywordsComponent },
// ];
@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    ChartsModule,
    // RouterModule.forChild(routes),
  ],
  exports :[
    Router
  ]
})
export class OverviewModule { }
