import { Injectable } from '@angular/core';
import { ProductsService } from '../../routes/products/products.service';
import { SettingsService } from '../settings/settings.service';
import { menu } from '../../routes/menu';

@Injectable()
export class MenuService {

    menuItems: Array<any>;
    isMenuLoad: boolean = false;

    constructor(public productsService: ProductsService, private settingService: SettingsService) {
        this.menuItems = [];
    }

    addMenu(items: Array<{
        text: string,
        heading?: boolean,
        link?: string,     // internal route links
        elink?: string,    // used only for external links
        target?: string,   // anchor target="_blank|_self|_parent|_top|framename"
        icon?: string,
        alert?: string,
        role?: string,
        submenu?: Array<any>
    }>) {
        items.forEach((item) => {
            this.menuItems.push(item);
        });
    }

    getMenu() {
        return this.menuItems;
    }

    menuCreation(companyId, items: Array<{
        text: string,
        heading?: boolean,
        link?: string,     // internal route links
        elink?: string,    // used only for external links
        target?: string,   // anchor target="_blank|_self|_parent|_top|framename"
        icon?: string,
        alert?: string,
        role?: string,
        submenu?: Array<any>
    }>) {
        this.menuItems = [];
        var filterOptionModel = {
            pageNumber: 1,
            pageSize: 1000,
            fields: '',
            searchQuery: 'CompanyID==\"' + companyId + '\"',
            orderBy: ''
        }
        this.productsService.getFilteredProduct(filterOptionModel).subscribe((response: any) => {
            var ProductList = [];
            if (response) {
                if (response.body != undefined && response.body != null && response.body.length > 0) {
                    const products = {
                        text: "All",
                        link: "/store/ALL",
                        icon: "fa fa-product-hunt"
                    };
                    ProductList.push(products);
                    response.body.forEach(element => {
                        const products = {
                            text: element.name,
                            link: "/store/" + element.id,
                            icon: "fa fa-product-hunt"
                        };
                        ProductList.push(products);
                    });
                }
            }
            items.forEach((item) => {
                if (item.text == "Fulfillment") {
                    item.submenu = ProductList;
                }
                this.menuItems.push(item);
                console.log(item);
            });
            this.isMenuLoad = true;
        })

    }
}
