import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialmediaSubmenuComponent } from './socialmedia-submenu/socialmedia-submenu.component';




@NgModule({
  declarations: [SocialmediaSubmenuComponent],
  imports: [
    CommonModule
  ],
  exports:[CommonModule,SocialmediaSubmenuComponent]
})
export class SocialmediaSubmenuModule { }
