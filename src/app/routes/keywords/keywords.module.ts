import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordsComponent } from './keywords/keywords.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    NgxSelectModule
  ],
  exports:[RouterModule]
})
export class KeywordsModule { }
