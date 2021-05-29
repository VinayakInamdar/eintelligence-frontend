import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SecurityService } from '../../services/security.service';

@Directive({
  selector: '[appHasClaim]'
})
export class HasClaimDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private securityService: SecurityService
  ) { }
  @Input("appHasClaim") set hasClaim(claimType: any) {
    var isClaimPresent = this.securityService.hasClaim(claimType);
    debugger;
    if (isClaimPresent == true) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }

  }
}
