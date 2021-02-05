import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmenuComponent } from './submenu/submenu.component';
//import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
//import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
//import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [SubmenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CommonModule, SubmenuComponent]
})
export class SubmenuModule { }