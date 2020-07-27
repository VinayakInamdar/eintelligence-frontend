import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import * as _ from 'lodash';
import { User } from '../user.model';
import { Router } from '@angular/router';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
    tableData: User[];    
    constructor(public http: HttpClient, public userService: UserService, private router: Router) {
        this.getUserList();
    }

    settings = {
        actions:{add: false, edit:false, delete:false},
        columns: {
          id: {
            title: 'Employee Number'
          },
          fName: {
            title: 'First Name'
          },
          lName: {
            title: 'Last Name'
          },
          email: {
            title: 'Email'
          }
        }
      }; 
    
    public userList: User[];    
   
    public ngOnInit(): void {
        //this.getUserList();
    }

    public getUserList(): void {
        this.userService.getUser().subscribe(
          res => {
            this.userList = res;
            this.tableData = this.userList;            
        });
    }
    
    public userRowSelect($event): any {        
        this.router.navigate(['/user/edituser/' + $event.data.id]);
    }
}