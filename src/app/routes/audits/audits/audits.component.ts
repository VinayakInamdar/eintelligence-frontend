import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CampaignService } from '../../campaign/campaign.service';
import { Router } from '@angular/router';
import { AuditsService } from '../audits.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AuditBadge } from './auditbadge.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterConfig } from 'angular2-toaster';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit {
  source: LocalDataSource;
  selectedtaskId: string;
  auditsData: any[];
  siteurl: string;
  toaster: any;
    valForm: FormGroup;
    public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });

  constructor(public http: HttpClient, public campaignService: CampaignService, private router: Router,
    public auditsService: AuditsService,fb: FormBuilder,public toastr : ToastrService) {

      this.valForm = fb.group({
        'webUrl': [undefined,[Validators.required,Validators.pattern(this.myreg)]],
    })
    }

  settings = {
    actions: { add: false, edit: false, delete: false },
    columns: {
      websiteUrl: {
        title: 'WEBSITE',
        filter: false
      },
      grade: {
        title: 'GRADE',
        filter: false,
        type: 'custom',
        renderComponent: AuditBadge,
      },
      createdOn: {
        title: 'DATE CREATED',
        valuePrepareFunction: (createdOn) => {

          return this.formatDate(createdOn)
        },
        filter: false
      },
      isSent: {
        title: 'SENT',
        filter: false
      },
    },

  };

  ngOnInit(): void {

    // using to get list of audits
    this.auditsService.getAudits().subscribe(res => {
      this.auditsData = res
    })
  }

  // using to navigate to agencyreport page to show report of selected taskId
  public userRowSelect(event) {
    this.selectedtaskId = event.data.taskId
    this.router.navigate(['/home/audits/auditreport', { id: this.selectedtaskId }]);

  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  onSearch(value) {}

  // using to run audit of entered url
  public runAudit(event,value) {
    if (this.valForm.invalid) {
      this.valForm.get('webUrl').markAsTouched();
    }
    else {
      this.toastr.info('Your Report is under progress...you can see your report when it is completed','Audit Report')
      this.auditsService.settingsTaskWebsite(value).subscribe(res=>{

      })
    }

  }

}

