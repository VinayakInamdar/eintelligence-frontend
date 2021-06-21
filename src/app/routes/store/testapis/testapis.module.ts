import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestApisComponent } from './testapis.component';
import { NgxStripeModule } from 'ngx-stripe';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
const routes: Routes = [

  { path: '', component: TestApisComponent }
];


@NgModule({
  declarations: [TestApisComponent],
  imports: [
    CommonModule,
    FormsModule,
    HighchartsChartModule,
    RouterModule.forChild(routes),
    // HighchartsChartModule,
    NgxStripeModule.forRoot('pk_test_51I0iLaEKoP0zJ89QGXq8ihvypBEzyryF6Y5Hiro0UDcPLQeCTzA0v8S6lYv2DNBZZS3LxICWKJATbOxzdUCOl73p00Her3EA2b'),

  ],
  exports: [
    RouterModule
]
})
export class TestApisModule { }
