import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { SigninOidcComponent } from '../signin-oidc/signin-oidc.component';
import { RequireAuthenticatedUserRouteGuardService } from '../shared/services/require-authenticated-user-route-guard.service';
import { LayoutwithoutsidebarComponent } from '../layout/layoutwithoutsidebar/layoutwithoutsidebar.component';

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
                path: 'campaignlist',
                component: LayoutComponent,
                loadChildren: () => import('./campaign/campagin.module').then(m => m.CampaginModule )
            },
            {
                path: 'campaign',
                component: LayoutComponent,
                loadChildren: () => import('./campaign/campagin.module').then(m => m.CampaginModule )
            },
            {
                path: 'campaign/:code/:scope/:authuser/:prompt',
                component: LayoutComponent,
                canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./campaign/campagin.module').then(m => m.CampaginModule )
            },
            {
                path: 'account',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
            },
            {
                path: 'store/:id',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
            },
            {
                path: 'products',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
            },
            {
                path: 'socialmedia',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./socialmedia/socialmedia.module').then(m => m.SocialmediaModule)
            },
            {
                path: 'linkedin',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./linkedin/linkedin.module').then(m => m.LinkedinModule)
            },
            {
                path: 'instagram',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./instagram/instagram.module').then(m => m.InstagramModule)
            },
            {
                path: 'gsc/:id',
                component: LayoutComponent,
                //canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./gscdata/gscdata.module').then(m => m.GscdataModule)
            },
            {
                path: 'mypayments',
                component: LayoutComponent,
                loadChildren: () => import('./mypayments/mypayments/mypayments.module').then(m => m.MyPaymentsModule)
            },
            {
                path: 'admin',
                component: LayoutComponent,
                // canActivate: [RequireAuthenticatedUserRouteGuardService],
                loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
            },
            {
                path: 'checkout/:planid/:productid',
                component: LayoutComponent,
                loadChildren: () => import('./store/checkout/checkout.module').then(m => m.CheckoutModule)
            },
            {
                path: 'checkoutsubscribe/:planid/:productid',
                component: LayoutComponent,
                loadChildren: () => import('./store/checkoutsubscribe/checkoutsubscribe.module').then(m => m.CheckoutSubscribeModule)
            },
            {
                path: 'paymentsuccess',
                component: LayoutComponent,
                loadChildren: () => import('./store/paymentsuccess/paymentsuccess.module').then(m => m.PaymentSuccessModule)
            },
            {
                path: 'test',
                component: LayoutComponent,
                loadChildren: () => import('./store/testapis/testapis.module').then(m => m.TestApisModule)
            },
            {
                path: 'paymentfailure',
                component: LayoutComponent,
                loadChildren: () => import('./store/paymentfailure/paymentfailure.module').then(m => m.PaymentFailureModule)
            },
            {
                path: 'overview',
                component: LayoutComponent,
                loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule)
            },
            {
                path: 'audits',
                component: LayoutComponent,
                loadChildren: () => import('./audits/audits.module').then(m => m.AuditsModule)
            },
            {
                path: 'auditreport',
                component: LayoutComponent,
                loadChildren: () => import('./auditreport/auditreport.module').then(m => m.AuditreportModule)
            },
            {
                path: ':id/analytics',
                component: LayoutComponent,
                loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
            },
            // {
            //     path: 'addkeywords',
            //     component: LayoutComponent,
            //     loadChildren: () => import('./keywords/keywords.module').then(m => m.KeywordsModule)
            // },
            {
                path: 'integrations/:id',
                component: LayoutComponent,
                loadChildren: () => import('./integrations/integrations.module').then(m => m.IntegrationsModule)
            },
            {
                path: 'leads',
                component: LayoutComponent,
                loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule)
            },
            {
                path: 'todo',
                component: LayoutComponent,
                loadChildren: () => import('./todolist/todolist.module').then(m => m.TodolistModule)
            },
            {
                path: 'proposal',
                component: LayoutComponent,
                loadChildren: () => import('./proposal/proposal.module').then(m => m.ProposalModule)
            },
            {
                path: 'privacy-policy',
                // component: LayoutComponent,
                loadChildren: () => import('./privacypolicy/privacypolicy.module').then(m => m.PrivacypolicyModule)
            },
            {
                path: 'terms-and-conditions',
                // component: LayoutComponent,
                loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsModule)
            },
            {
                path: 'google-ads',
                component: LayoutComponent,
                loadChildren: () => import('./google-ads/google-ads.module').then(m => m.GoogleAdsModule)
            },
            {
                path: 'user-list',
                component: LayoutComponent,
                loadChildren: () => import('./invite-user/invite-user.module').then(m => m.InviteUserModule)
            },
            {
                path: 'campaignuser-list',
                component: LayoutComponent,
                loadChildren: () => import('./campaign-user/campaign-user.module').then(m => m.CampaignUserModule)
            },
        ]
    },
    
    {  
        path: 'company',
        component: LayoutwithoutsidebarComponent,
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
    },
    // Not found
    { path: '**', redirectTo: 'home' }

];
