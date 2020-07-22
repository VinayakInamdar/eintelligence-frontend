import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from './success/success.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgencyComponent } from '../agency/agency/agency.component';


const routes: Routes = [
  { path: '', component: SuccessComponent },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    NgxSelectModule,
    RouterModule
  ],
  exports: [
    RouterModule,
  ],
})
export class SuccessModule { }
