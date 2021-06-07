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
      },
        columns: {
          agency_name: {
            title: 'AGENCY NAME',
            filter: false
          },
          fName: {
            title: 'FIRST NAME',
            filter: false
          },
          lName: {
            title: 'LAST NAME',
            filter: false
          },
          email: {
            title: 'EMAIL',
            filter: false
          }
        }
      }; 
    
    public agencyList: IAgency[];    
   
    public ngOnInit(): void {
        //this.getagencyList();
    }

     // using to get user list
    public getAgencyList(): void {
        this.adminService.getAgency().subscribe(
          res => {
            this.agencyList = res;
            this.tableData = this.agencyList;  
            this.source = new LocalDataSource(this.agencyList)         
        });
    }
    
     // using to go to campaignList to show campaigns of selected agency
    public onAgencyRowSelected(event):any {
      this.router.navigate(['/admin/campaignlist/' + event.data.id]);
    }

}
