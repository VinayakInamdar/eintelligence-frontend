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

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'campagin', component: CampaginComponent }
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
        NgxSelectModule
    ],
    declarations: [HomeComponent, CampaginComponent],
    exports: [
        RouterModule
    ]
})
export class HomeModule { }
