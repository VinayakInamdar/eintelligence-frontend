
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CampaginComponent } from './campagin/campagin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ChartsModule } from 'ng2-charts';
import { OverviewComponent } from '../overview/overview/overview.component';
import { KeywordsComponent } from '../seo/keywords/keywords.component';
import { AnalyticsComponent } from '../analytics/analytics/analytics.component';
import { AcquisitionComponent } from '../analytics/acquisition/acquisition.component';
import { TrafficSourcesComponent } from '../analytics/traffic-sources/traffic-sources.component';
import { SourcesMediumsComponent } from '../analytics/sources-mediums/sources-mediums.component';
import { CampaignsComponent } from '../analytics/campaigns/campaigns.component';
import { AudienceComponent } from '../analytics/audience/audience.component';
import { DeviceCategoryComponent } from '../analytics/device-category/device-category.component';
import { GeoLocationsComponent } from '../analytics/geo-locations/geo-locations.component';
import { LanguagesComponent } from '../analytics/languages/languages.component';
import { BehaviorComponent } from '../analytics/behavior/behavior.component';
import { LandingPagesComponent } from '../analytics/landing-pages/landing-pages.component';
import { EventsComponent } from '../analytics/events/events.component';
import { SiteSpeedComponent } from '../analytics/site-speed/site-speed.component';
import { ConversionsComponent } from '../analytics/conversions/conversions.component';
import { EcommerceComponent } from '../analytics/ecommerce/ecommerce.component';
import { GoalsComponent } from '../analytics/goals/goals.component';
import { SeoComponent } from '../seo/seo/seo.component';




const routes: Routes = [

    { path: '', component: CampaginComponent },
    { path: 'overview', component: OverviewComponent },
    { path: ':id/seo/keywords', component: KeywordsComponent },
    { path: ':id/analytics', component: AnalyticsComponent },
    { path: ':id/analytics/acquisition', component: AcquisitionComponent },
    { path: ':id/analytics/acquisition/traffic-sources', component: TrafficSourcesComponent },
    { path: ':id/analytics/acquisition/sources-mediums', component: SourcesMediumsComponent },
    { path: ':id/analytics/acquisition/campaigns', component: CampaignsComponent },
    { path: ':id/analytics/audience', component: AudienceComponent },
    { path: ':id/analytics/audience/device-category', component: DeviceCategoryComponent },
    { path: ':id/analytics/audience/geolocation', component: GeoLocationsComponent },
    { path: ':id/analytics/audience/languages', component: LanguagesComponent },
    { path: ':id/analytics/behavior', component: BehaviorComponent },
    { path: ':id/analytics/behavior/landing-pages', component: LandingPagesComponent },
    { path: ':id/analytics/behavior/events', component: EventsComponent },
    { path: ':id/analytics/behavior/site-speed', component: SiteSpeedComponent },
    { path: ':id/analytics/conversions', component: ConversionsComponent },
    { path: ':id/analytics/conversions/ecommerce', component: EcommerceComponent },
    { path: ':id/analytics/conversions/goals', component: GoalsComponent },
    { path: ':id/seo', component: SeoComponent },


];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2SmartTableModule,
        ChartsModule
    ],
    declarations: [KeywordsComponent,AnalyticsComponent,AcquisitionComponent,
        TrafficSourcesComponent,SourcesMediumsComponent,CampaignsComponent,
        AudienceComponent,DeviceCategoryComponent,GeoLocationsComponent,LanguagesComponent
    ,BehaviorComponent,LandingPagesComponent,EventsComponent,
    SiteSpeedComponent,ConversionsComponent,SeoComponent,EcommerceComponent,GoalsComponent],
    exports: [
        RouterModule
    ]
})
export class CampaginModule { }
