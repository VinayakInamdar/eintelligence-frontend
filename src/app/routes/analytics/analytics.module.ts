import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

const routes: Routes = [
  { path: '', component: AnalyticsComponent }
];

@NgModule({
 
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
    NgxIntlTelInputModule
  ],
  declarations: [AnalyticsComponent],
  exports: [
    RouterModule,
],
})
export class AnalyticsModule { }
