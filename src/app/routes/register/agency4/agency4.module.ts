import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { NgxSelectModule } from 'ngx-select-ex';
import { Agency4Component } from './agency4.component';
import { HomeComponent } from '../../home/home/home.component';

const routes: Routes = [
  { path: '', component: Agency4Component },
  //{ path: 'home', component: HomeComponent }
];


@NgModule({
  declarations: [Agency4Component],
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
export class Agency4Module { }
