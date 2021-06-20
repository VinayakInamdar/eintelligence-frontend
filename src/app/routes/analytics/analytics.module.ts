import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ChartsModule } from 'ng2-charts';
import { AcquisitionComponent } from './acquisition/acquisition.component';
import { TrafficSourcesComponent } from './traffic-sources/traffic-sources.component';
import { SourcesMediumsComponent } from './sources-mediums/sources-mediums.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { AudienceComponent } from './audience/audience.component';
import { DeviceCategoryComponent } from './device-category/device-category.component';
import { GeoLocationsComponent } from './geo-locations/geo-locations.component';
import { LanguagesComponent } from './languages/languages.component';
import { BehaviorComponent } from './behavior/behavior.component';
import { LandingPagesComponent } from './landing-pages/landing-pages.component';
import { EventsComponent } from './events/events.component';
import { SiteSpeedComponent } from './site-speed/site-speed.component';
import { ConversionsComponent } from './conversions/conversions.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { GoalsComponent } from './goals/goals.component';
import { GoogleChartsModule } from 'angular-google-charts';
// import { HighchartsChartModule } from 'highcharts-angular';
const routes: Routes = [
  { path: '', component: AnalyticsComponent },
];
@NgModule({
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
    GoogleChartsModule.forRoot({ version: 'chart-version' }),
    // HighchartsChartModule
  ],
  declarations: [SourcesMediumsComponent, AudienceComponent, DeviceCategoryComponent, GeoLocationsComponent, LanguagesComponent, BehaviorComponent, LandingPagesComponent, EventsComponent, SiteSpeedComponent, ConversionsComponent, EcommerceComponent, GoalsComponent],
  exports: [
    RouterModule,
],
})
export class AnalyticsModule { }
