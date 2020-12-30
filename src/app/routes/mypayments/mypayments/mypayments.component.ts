import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  templateUrl: './mypayments.component.html',
  styleUrls: ['./mypayments.component.scss']
})
export class MyPaymentsComponent implements OnInit {

  errorMessage = '';
  settingActive = 1;
  maxHeight = window.innerHeight;
  
  constructor(public router :Router) { }

  ngOnInit(): void {

  }
  public onClick(planid,productid): any {
    this.router.navigate(['/checkout',productid,planid]);
  }

}

