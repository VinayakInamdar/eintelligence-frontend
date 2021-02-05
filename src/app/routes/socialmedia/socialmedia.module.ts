import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxSelectModule } from 'ngx-select-ex';
import { FacebookModule } from 'ngx-facebook';
import { SubmenuModule } from '../submenu/submenu.module';
import { SocialmediaSubmenuModule } from '../socialmedia-submenu/socialmedia-submenu.module';
const routes: Routes = [
  { path: '', component: SocialmediaComponent }
];

@NgModule({
  declarations: [SocialmediaComponent],
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
    ChartsModule,
    FacebookModule.forRoot(),
    SubmenuModule,
    SocialmediaSubmenuModule
  ],
  exports: [RouterModule]
})
export class SocialmediaModule { }
