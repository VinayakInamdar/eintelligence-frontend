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
        ChartsModule
    ],
    declarations: [HomeComponent, CampaginComponent,OverviewComponent,AuditsComponent,AuditreportComponent],
    exports: [
        RouterModule
    ]
})
export class HomeModule { }
