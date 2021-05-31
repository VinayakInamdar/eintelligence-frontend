import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';
import { menu } from './menu';
import { routes } from './routes';
import { RegisterComponent } from './register/register/register.component';
import { SuccessComponent } from './register/success/success/success.component';
import { SettingsService } from '../core/settings/settings.service';




@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [RegisterComponent, SuccessComponent],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService,public settingsservice:SettingsService) {
       
            menuService.addMenu(menu);
       
    }
}
