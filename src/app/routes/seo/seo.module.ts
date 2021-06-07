import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoComponent } from './seo/seo.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { SubmenuModule } from '../submenu/submenu.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from 'src/app/shared/shared.module';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { routes } from '../routes';

@NgModule({
  declarations: [SeoComponent, KeywordsComponent],
  imports: [
    CommonModule,
    SubmenuModule,
    SocialLoginModule,
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
    SocialLoginModule
  ],
providers: [
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
exports: [RouterModule]
})
export class SeoModule { }
