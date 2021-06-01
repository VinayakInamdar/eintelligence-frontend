import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SettingsService } from "../../../core/settings/settings.service";
import { environment } from "../../../../environments/environment";
import { ProductsService } from "../../products/products.service";

@Injectable({
    providedIn: 'root'
})
export class StoreResolverService implements Resolve<any>{

    constructor(public settingService: SettingsService, public productsService: ProductsService,) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        if (!environment.production) { console.log('Logging collected route parameter', route.params['name']); }
        var companyId = this.settingService.selectedCompanyInfo.companyId;
        if (route.params['id'] == "ALL") {
            return this.productsService.getAllPlanByCompanyId(companyId);
        }
        else {
            return this.productsService.getPlansByProductId(route.params['id']);
        }

    }
}