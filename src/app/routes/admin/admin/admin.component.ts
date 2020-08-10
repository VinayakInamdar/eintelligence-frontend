import { Component, OnInit } from '@angular/core';
import { IAgency } from '../agency.model'
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  tableData: IAgency[]; 
    source:LocalDataSource;   

  
    constructor(public http: HttpClient, public adminService: AdminService, private router: Router,
     private translate: TranslateService,) {
        
      this.getAgencyList();
    }

    settings = {
        actions:{columnTitle: 'Actions',
        add: false,
        edit: false,
        delete: false,
      //   custom: [
      //   { name: 'editrecord',type:'html', title: '<button type="button" class="btn btn-outline-primary">Edit</button>'},
      //   { name: 'deleterecord', title: '&nbsp;&nbsp;<button type="button" class="btn btn-outline-primary">Delete</button>'},
      // ],
      
        // position: 'right'
      },
        // edit: {
        //   editButtonContent: '<i class="nb-edit"></i>',
        //   saveButtonContent: '<i class="nb-checkmark"></i>',
        //   cancelButtonContent: '<i class="nb-close"></i>',
        //   confirmSave: true
        // },
        columns: {
          agency_name: {
            title: 'Agency Name',
            filter: false
          },
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
    
    public agencyList: IAgency[];    
   
    public ngOnInit(): void {
        //this.getagencyList();
    }
  //   // using to check event for edit and delete user
  //   public onCustomAction(event) {
  //     switch ( event.action) {
  //       case 'editrecord':
  //         this.editUserById(event);
  //         break;
  //      case 'deleterecord':
  //         this.deleteUserById(event);
  //     }
  //   }
  // // using to search user locally
  // onSearch(query: string = '') {
  //   if(query == "") {
  //     this.source = new LocalDataSource(this.agencyList)
  //   }
  //   else {
  //     this.source.setFilter([
  //       // fields we want to include in the search
  //       {
  //         field: 'name',
  //         search: query
  //       },
  //       {
  //         field: 'username',
  //         search: query
  //       },
  //       {
  //         field: 'email',
  //         search: query
  //       }
  //     ], false); 
  //     // second parameter specifying whether to perform 'AND' or 'OR' search 
  //     // (meaning all columns should contain search query or at least one)
  //     // 'AND' by default, so changing to 'OR' by setting false here
  //   }
    
  // }
     // using to get user list
    public getAgencyList(): void {
        this.adminService.getAgency().subscribe(
          res => {
            this.agencyList = res;
            this.tableData = this.agencyList;  
            this.source = new LocalDataSource(this.agencyList)         
        });
    }
    

    public onAgencyRowSelected(event):any {
      this.router.navigate(['/admin/campaignlist/' + event.data.id]);
    }

}
