import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditreportComponent } from './auditreport/auditreport.component';
import { SharedModule } from './../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { RoutesModule } from '../routes.module';
import { Router } from '@angular/router';
import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    ChartsModule
  ],
  exports :[
    Router
  ]
})
export class AuditreportModule { }
