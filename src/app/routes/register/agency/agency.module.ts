import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyComponent } from './agency/agency.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { NgxSelectModule } from 'ngx-select-ex';

const routes: Routes = [
  { path: '', component: AgencyComponent },

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
export class AgencyModule { }
