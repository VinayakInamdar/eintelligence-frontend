import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-socialmedia-submenu',
  templateUrl: './socialmedia-submenu.component.html',
  styleUrls: ['./socialmedia-submenu.component.scss']
})
export class SocialmediaSubmenuComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
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
}
