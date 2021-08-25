import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';

@Component({
  selector: 'app-agency-activated',
  templateUrl: './agency-activated.component.html',
  styleUrls: ['./agency-activated.component.scss']
})
export class AgencyActivatedComponent implements OnInit {


  constructor(public router: Router,public _openIdConnectService: OpenIdConnectService) { }

  ngOnInit(): void {
  }


  public onClick(): any {
    this._openIdConnectService.triggerSignIn();
    window.onpopstate = function (e) { window.history.forward(); }
  }

}
