import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToInviteUser(){
    this.router.navigate(['user-list/invite-user']);
  }
}
