import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency2',
  templateUrl: './agency2.component.html',
  styleUrls: ['./agency2.component.scss']
})
export class Agency2Component implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  public onClick(): any {
    this.router.navigate(['/agency3']);
  }
}
