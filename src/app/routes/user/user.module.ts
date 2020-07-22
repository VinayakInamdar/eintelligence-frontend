import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule, } from 'ngx-select-ex'
import { ToasterService, ToasterModule } from 'angular2-toaster/angular2-toaster';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CreateUserComponent } from './createuser/createuser.component';
import { EditUserComponent } from './edituser/edituser.component';

const routes: Routes = [
    { path: '', component: UserComponent },
    { path: 'createuser', component: CreateUserComponent },
    { path: 'edituser/:id', component: EditUserComponent },
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
        ToasterModule
    ],
    declarations: [UserComponent, CreateUserComponent, EditUserComponent],    
    exports: [
        RouterModule,
    ],
    providers: [
        ToasterService
    ]
})
export class UserModule {

}