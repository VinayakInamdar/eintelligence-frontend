import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency3',
  templateUrl: './agency3.component.html',
  styleUrls: ['./agency3.component.scss']
})
export class Agency3Component implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  public onClick(): any {
    this.router.navigate(['/agency4']);
  }
}
