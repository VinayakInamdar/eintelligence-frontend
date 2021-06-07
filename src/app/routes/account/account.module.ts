import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { AccountComponent, DialogContentExampleDialog } from './account/account.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

const routes: Routes = [
  { path: '', component: AccountComponent }
];

@NgModule({
  declarations: [AccountComponent,DialogContentExampleDialog],
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
 
  exports: [
    RouterModule,
],
})
export class AccountModule { }
