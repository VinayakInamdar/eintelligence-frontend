import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteUserComponent } from './invite-user/invite-user.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ChartsModule } from 'ng2-charts';
import { SubmenuModule } from '../submenu/submenu.module';
import { SocialmediaSubmenuModule } from '../socialmedia-submenu/socialmedia-submenu.module';
import { UserlistComponent } from './userlist/userlist.component';


const routes: Routes = [
  {
    path: '', component: UserlistComponent
  },
  { path: 'invite-user', component: InviteUserComponent }
];

@NgModule({
  declarations: [InviteUserComponent, UserlistComponent],
  imports: [
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
    SubmenuModule,
    SocialmediaSubmenuModule
  ],
  exports: [
    RouterModule,
  ]
})
export class InviteUserModule { }
