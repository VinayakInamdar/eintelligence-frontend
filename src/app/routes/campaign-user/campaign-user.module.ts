import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignUserlistComponent } from './campaign-userlist/campaign-userlist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  {
    path: '', component: CampaignUserlistComponent },
]
@NgModule({
  declarations: [CampaignUserlistComponent],
  imports: [
    CommonModule,
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
   
  ],
  exports: [
    RouterModule,
  ]
})
export class CampaignUserModule { }
