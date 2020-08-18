
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CampaginComponent } from './campagin/campagin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ChartsModule } from 'ng2-charts';
import { OverviewComponent } from '../overview/overview/overview.component';
import { KeywordsComponent } from '../keywords/keywords/keywords.component';




const routes: Routes = [

    { path: '', component: CampaginComponent },
    { path: 'overview', component: OverviewComponent },
    { path: ':id/seo/keywords', component: KeywordsComponent }

];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2SmartTableModule,
        ChartsModule
    ],
    declarations: [KeywordsComponent],
    exports: [
        RouterModule
    ]
})
export class CampaginModule { }
