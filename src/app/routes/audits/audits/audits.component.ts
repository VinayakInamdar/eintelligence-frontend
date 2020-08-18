import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {IAudits} from '../audits.modal';
import { HttpClient } from '@angular/common/http';
import { CampaignService } from '../../campaign/campaign.service';
import { Router } from '@angular/router';
import { AuditsService } from '../audits.service';
import { LocalDataSource } from 'ng2-smart-table';
import {NgClass} from '@angular/common';
import { AuditBadge } from './auditbadge.component';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit {
  source: LocalDataSource;
  selectedtaskId: string;
  auditsData : any[];

  constructor(public http: HttpClient, public campaignService: CampaignService, private router: Router,
  public auditsService:AuditsService) { }
  
  settings = {
    actions:{add: false, edit:false, delete:false},
    columns: {
      websiteUrl: {
        title: 'WEBSITE',
        filter: false
      },
      grade: {
        title: 'GRADE',
        filter: false,
        type:'custom',
        renderComponent: AuditBadge,
      },
      date_created: {
        title: 'DATE CREATED',
        filter : false
      },
      isSent: {
        title: 'SENT',
        filter : false
      },
    }
  };

  ngOnInit(): void {

    // using to get list of audits
    this.auditsService.getAudits().subscribe(res=>{
      this.auditsData = res
    })
  }
 
  // using to navigate to agencyreport page to show report of selected taskId
  public userRowSelect(event) {
    this.selectedtaskId = event.data.taskId
    this.router.navigate(['/home/audits/auditreport', {id : this.selectedtaskId}]);

  }

}

