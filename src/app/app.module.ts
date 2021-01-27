import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { SigninOidcComponent } from './signin-oidc/signin-oidc.component';
import { RequireAuthenticatedUserRouteGuardService } from './shared/services/require-authenticated-user-route-guard.service';
import { OpenIdConnectService } from './shared/services/open-id-connect.service';
import { RegisterComponent } from './routes/register/register/register.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ChartsModule } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        SigninOidcComponent
        //RegisterComponent
    ],
    imports: [
        HttpClientModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        NgxSummernoteModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })  ,
        ChartsModule,
        MatSnackBarModule
    ],
    providers: [
        DatePipe,
        RequireAuthenticatedUserRouteGuardService,
        OpenIdConnectService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
