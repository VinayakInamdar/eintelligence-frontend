import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterConfig, ToasterService } from 'angular2-toaster/angular2-toaster';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
    tableData: User[]; 
    source:LocalDataSource;   

    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });
    constructor(public http: HttpClient, public userService: UserService, private router: Router,
      public toasterService: ToasterService,private translate: TranslateService,) {
        
      this.getUserList();
    }

    settings = {
        actions:{columnTitle: 'Actions',
        add: false,
        edit: false,
        delete: false,
        custom: [
        { name: 'editrecord',type:'html', title: '<button type="button" class="btn btn-outline-primary">Edit</button>'},
        { name: 'deleterecord', title: '&nbsp;&nbsp;<button type="button" class="btn btn-outline-primary">Delete</button>'},
      ],
      
        position: 'right'},
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true
        },
        columns: {
          fName: {
            title: 'First Name',
            filter: false
          },
          lName: {
            title: 'Last Name',
            filter: false
          },
          email: {
            title: 'Email',
            filter: false
          }
        }
      }; 
    
    public userList: User[];    
   
    public ngOnInit(): void {
        //this.getUserList();
    }
    public onCustomAction(event) {
      switch ( event.action) {
        case 'editrecord':
          this.userRowSelect(event);
          break;
       case 'deleterecord':
          this.deleteUserById(event);
      }
    }
  editRecord(data: any) {
    throw new Error("Method not implemented.");
  }
  viewRecord(data: any) {
    throw new Error("Method not implemented.");
  }
  onSearch(query: string = '') {
    if(query == "") {
      this.source = new LocalDataSource(this.userList)
    }
    else {
      this.source.setFilter([
        // fields we want to include in the search
        {
          field: 'name',
          search: query
        },
        {
          field: 'username',
          search: query
        },
        {
          field: 'email',
          search: query
        }
      ], false); 
      // second parameter specifying whether to perform 'AND' or 'OR' search 
      // (meaning all columns should contain search query or at least one)
      // 'AND' by default, so changing to 'OR' by setting false here
    }
    
  }

    public getUserList(): void {
        this.userService.getUser().subscribe(
          res => {
            this.userList = res;
            this.tableData = this.userList;  
            this.source = new LocalDataSource(this.userList)         
        });
    }
    
    public userRowSelect($event): any {        
        this.router.navigate(['/user/edituser/' + $event.data.id]);
    }
    public deleteUserById($event): any {
      // this.userService.deleteUserById($event.data.id)
                  //Toaster
                  this.toaster = {
                    type: this.translate.instant('toaster.success.TYPE'),
                    title: this.translate.instant('toaster.success.TITLE'),
                    text: this.translate.instant('message.UPDATEMSG'),
                };
                this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);
    }
}