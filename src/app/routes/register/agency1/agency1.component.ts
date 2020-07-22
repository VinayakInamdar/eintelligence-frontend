import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency1',
  templateUrl: './agency1.component.html',
  styleUrls: ['./agency1.component.scss']
})
export class Agency1Component implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  public onClick(): any {
    this.router.navigate(['/agency2']);
  }
}
