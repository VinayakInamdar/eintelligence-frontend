import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  public onClick(): any {
    this.router.navigate(['/agency1']);
  }
}
