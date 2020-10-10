import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogContentExampleDialog, ProposalComponent } from './proposal/proposal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  { path: '', component: ProposalComponent }
];

@NgModule({
  declarations: [ProposalComponent,DialogContentExampleDialog],
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
    AccordionModule.forRoot(),
    ModalModule.forRoot()
  ],
 
  exports: [
    RouterModule,
],
})
export class ProposalModule { }
