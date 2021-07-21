import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignFullfillmentComponent } from './campaign-fullfillment/campaign-fullfillment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {
    path: '', component: CampaignFullfillmentComponent
  },
]

@NgModule({
  declarations: [CampaignFullfillmentComponent],
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
export class CampaignFulfillmentModule { }
