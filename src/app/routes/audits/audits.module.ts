import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { AuditreportComponent } from '../auditreport/auditreport/auditreport.component';
import { ToastrModule } from 'ngx-toastr';
const routes: Routes = [
  { path: '', component: AuditreportComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    RouterModule.forChild(routes),
    SharedModule,
    ToastrModule.forRoot()
  ]
})
export class AuditsModule { }
