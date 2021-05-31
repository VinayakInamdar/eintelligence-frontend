import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ChartsModule } from 'ng2-charts';
import { SubmenuModule } from '../submenu/submenu.module';
import { SocialmediaSubmenuModule } from '../socialmedia-submenu/socialmedia-submenu.module';
import { CompanyListComponent } from './company-list/company-list.component';
import { LayoutModule } from 'src/app/layout/layout.module';
import { CampaginComponent } from '../campaign/campagin/campagin.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: 'campaign', component: CampaginComponent }
]

@NgModule({
  declarations: [CompanyListComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileUploadModule,
    NgxSelectModule,
    NgxIntlTelInputModule,
    ChartsModule,
    SubmenuModule,
    SocialmediaSubmenuModule
  ],
  exports: [
    RouterModule,
  ]
})
export class CompanyModule { }
