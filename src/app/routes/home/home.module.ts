import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { CampaginComponent } from '../campaign/campagin/campagin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { OverviewComponent } from '../overview/overview/overview.component';
import { ChartsModule } from 'ng2-charts';
import { AuditsComponent } from '../audits/audits/audits.component';
import { AuditreportComponent } from '../auditreport/auditreport/auditreport.component';
import {ToasterModule, ToasterService,ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { FacebookModule } from 'ngx-facebook';
const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'campaign', component: CampaginComponent },
    { path: 'overview', component: OverviewComponent },
    { path : 'audits',component: AuditsComponent},
    { path : 'audits/auditreport',component: AuditreportComponent}
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FileUploadModule,
        FormsModule,
        NgxSelectModule,
        ChartsModule,
        ToasterModule,
        ToastrModule.forRoot(),
        SocialLoginModule,
        FacebookModule.forRoot(),
    ],
    providers: [
        ToasterService,
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [    
              {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(
                  '959505317275-v8294ho5b3prni9rqi4l6nnb8463uiig.apps.googleusercontent.com'//CLient id
                )
              },
              
            ]
          } as SocialAuthServiceConfig,
        }
      ],
    declarations: [HomeComponent, CampaginComponent,OverviewComponent,AuditsComponent,AuditreportComponent],
    exports: [
        RouterModule
    ],

})
export class HomeModule { }
