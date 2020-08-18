import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationsComponent } from './integrations/integrations.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: IntegrationsComponent }
];

@NgModule({
  declarations: [IntegrationsComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports:[RouterModule]
})
export class IntegrationsModule { }
