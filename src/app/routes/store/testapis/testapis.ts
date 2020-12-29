import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestApisComponent } from './testapis.component';

const routes: Routes = [

  { path: '', component: TestApisComponent }
];


@NgModule({
  declarations: [TestApisComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
]
})
export class TestApisModule { }
