import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { SuccessComponent } from './success/success/success.component';
import { AgencyComponent } from './agency/agency/agency.component';
import { Agency1Component } from './agency1/agency1.component';
import { Agency2Component } from './agency2/agency2.component';
import { Agency3Component } from './agency3/agency3.component';
import { Agency4Component } from './agency4/agency4.component';
import { LoginComponent } from './login/log in/login.component';
import { HomeComponent } from '../home/home/home.component';



const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'agency', component: AgencyComponent },
  { path: 'agency1', component: Agency1Component },
  { path: 'agency2', component: Agency2Component },
  { path: 'agency3', component: Agency3Component },
  { path: 'agency4', component: Agency4Component },
  //{ path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  //declarations: [RegisterComponent],
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
  declarations: [Agency1Component, Agency2Component, Agency3Component]
})
export class RegisterModule { }
