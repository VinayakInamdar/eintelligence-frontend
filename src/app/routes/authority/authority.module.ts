import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { SharedModule } from '../../shared/shared.module';
import { NgxSelectModule, } from 'ngx-select-ex'
import { AuthorityComponent } from './authority/authority.component';


const routes: Routes = [
    { path: '', component: AuthorityComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2TableModule,
        NgxSelectModule
    ],
    declarations: [AuthorityComponent],
    exports: [
        RouterModule
    ]
})
export class AuthorityModule { }
