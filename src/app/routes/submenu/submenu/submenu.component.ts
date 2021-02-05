import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent implements OnInit {
  selectedCampId: string;


  constructor(public router: Router) { 
    debugger
    this.selectedCampId = localStorage.getItem("selectedCampId")
  }

  ngOnInit(): void {
  }
  public goToSeoOverview(event) {
    debugger
    this.router.navigate([`../campaign/:id${this.selectedCampId}/seo`])
  }
  public goToSocialMedia(event) {
    this.router.navigate([`/socialmedia`])
  }
  /*
  public goToSeoOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo`])
  }
  public goToSocialMedia(event) {

    this.router.navigate([`/socialmedia`])
  }
  public goToLinkedIn(event) {

    this.router.navigate([`/linkedin`])
  }
  public goToInstagram(event) {

    this.router.navigate([`/instagram`])
  }
  public goToGSC(event) {

    this.router.navigate([`/gsc`])
  }*/
}
