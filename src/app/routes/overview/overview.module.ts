import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { KeywordsComponent } from '../seo/keywords/keywords.component';
import { SubmenuModule } from '../submenu/submenu.module';
@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    ChartsModule,
    SubmenuModule
  ],
  exports :[
    Router
  ]
})
export class OverviewModule { }
