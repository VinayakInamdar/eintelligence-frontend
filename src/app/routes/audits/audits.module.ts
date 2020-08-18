import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaginComponent } from '../campaign/campagin/campagin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { OverviewComponent } from '../overview/overview/overview.component';
import { ChartsModule } from 'ng2-charts';
import {  AuditBadge } from './audits/auditbadge.component';
import { AuditsComponent } from './audits/audits.component';
import { CommonModule } from '@angular/common';
import { AuditreportComponent } from '../auditreport/auditreport/auditreport.component';

const routes: Routes = [
  { path: '', component: AuditreportComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AuditsModule { }
