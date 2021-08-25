import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';

@Component({
  selector: 'app-agency-failed',
  templateUrl: './agency-failed.component.html',
  styleUrls: ['./agency-failed.component.scss']
})
export class AgencyFailedComponent implements OnInit {

  constructor(public router: Router,public _openIdConnectService: OpenIdConnectService) { }

  ngOnInit(): void {
  }

  public onClick(): any {
    this._openIdConnectService.triggerSignOut();
    // window.onpopstate = function (e) { window.history.(); }
  }

  

}
