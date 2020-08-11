
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CampaginComponent } from './campagin/campagin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OverviewComponent } from '../overview/overview/overview.component';




const routes: Routes = [

    { path: '', component: CampaginComponent },
    { path: 'overview', component: OverviewComponent }

];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2SmartTableModule
    ],
    declarations: [CampaginComponent],
    exports: [
        RouterModule
    ]
})
export class CampaginModule { }
