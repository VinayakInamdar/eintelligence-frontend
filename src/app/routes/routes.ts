import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { SigninOidcComponent } from '../signin-oidc/signin-oidc.component';
import { RequireAuthenticatedUserRouteGuardService } from '../shared/services/require-authenticated-user-route-guard.service';

export const routes: Routes = [

    {
        path: '',
       
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                component: LayoutComponent,
                canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'dashboard',
                component: LayoutComponent,
                canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'signin-oidc',
                component: SigninOidcComponent
            },
            {
                path: 'user',
                component: LayoutComponent,
                canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            },
            {
                path: 'register',
                loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
            },
            {
                path: 'success',
                loadChildren: () => import('./register/success/success.module').then(m => m.SuccessModule)
            },
            {
                path: 'agency',
                loadChildren: () => import('./register/agency/agency.module').then(m => m.AgencyModule)
            },
            {
                path: 'agency1',
                loadChildren: () => import('./register/agency1/agency1.module').then(m => m.Agency1Module)
            },
            {
                path: 'agency2',
                loadChildren: () => import('./register/agency2/agency2.module').then(m => m.Agency2Module)
            },
            {
                path: 'agency3',
                loadChildren: () => import('./register/agency3/agency3.module').then(m => m.Agency3Module)
            },
            {
                path: 'agency4',
                loadChildren: () => import('./register/agency4/agency4.module').then(m => m.Agency4Module)
            },
            {
                path: 'login',
                loadChildren: () => import('./register/login/login.module').then(m => m.LoginModule)
            },
            {
                path: 'campaign',
                loadChildren: () => import('./campaign/campagin.module').then(m => m.CampaginModule )
            },
            {
                path: 'account',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
            },
            {
                path: 'analytics',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
            },
        ]
    },
    

    // Not found
    { path: '**', redirectTo: 'home' }

];
