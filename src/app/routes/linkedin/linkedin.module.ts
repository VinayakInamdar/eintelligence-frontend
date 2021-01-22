import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedinComponent } from './linkedin/linkedin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: LinkedinComponent }
];

@NgModule({
  declarations: [LinkedinComponent],
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
    NgxIntlTelInputModule,
    ChartsModule
 ]
})
export class LinkedinModule { }
