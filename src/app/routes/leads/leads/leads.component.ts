import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
declare var $: any;
@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  settingActive: number = 1;
  oneAtATime: boolean = true;
  isOpenFirst: boolean = true;
  isOpenSecond: boolean = false;
  isOpenThird: boolean = false;
  isOpenFour: boolean = false;
  profileInfo = new FormGroup({
    firstname: new FormControl(undefined, [Validators.required]),
    position: new FormControl(undefined),
    email: new FormControl(undefined),
    phone: new FormControl(undefined),
    company: new FormControl(undefined),
    dealsize: new FormControl(undefined)
  })
  settings = {
    selectMode: 'multi',
    actions: {
      delete: false,
      add: false,
      edit: false,
      select: true,
    },
    columns: {
      name: {
        title: 'NAME',
        filter: false
      },
      company: {
        title: 'Company',
        filter: false
      },
      moreTraffic: {
        created: 'Created',
        filter: false
      },
      tags: {
        title: 'Tags',
        filter: false
      },
      assigned: {
        title: 'Assigned',
        filter: false,
        type: 'custom',
        renderComponent: '<i class="fa fa-user"></i>'
      },
      deal_size: {
        title: 'Deal Size',
        filter: false
      },
      status: {
        title: 'Status',
        filter: false
      }

    }
  };
  source: LocalDataSource;
  constructor() { }

  ngOnInit(): void {
    var userList = [{ name: "Bruce Wayne", company: 'Justice League Inc.', created: "3 Days ago", tags: "fhdsjfsnfdsjfnlds", assigned: '', deal_size: "$ 50,000.00", status: 'Discovery' }]
    this.source = new LocalDataSource(userList)
  }

  // using to change view according to setting active
  public changeSettingActive(value) {
    this.settingActive = value
  }

  userRowSelect(event) {}

  onSearch(value) {}

  submitForm(value, formName) {}

}
