import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency4',
  templateUrl: './agency4.component.html',
  styleUrls: ['./agency4.component.scss']
})
export class Agency4Component implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  public onClick(): any {
    this.router.navigate(['/home']);
  }
}
