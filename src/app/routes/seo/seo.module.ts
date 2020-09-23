import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoComponent } from './seo/seo.component';
import { KeywordsComponent } from './keywords/keywords.component';



@NgModule({
  declarations: [SeoComponent, KeywordsComponent],
  imports: [
    CommonModule
  ]
})
export class SeoModule { }
