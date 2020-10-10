import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {
  modalRef: BsModalRef;
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
  constructor(private modalService: BsModalService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    var userList = [{ name: "Bruce Wayne", company: 'Justice League Inc.', created: "3 Days ago", tags: "fhdsjfsnfdsjfnlds", assigned: '', deal_size: "$ 50,000.00", status: 'Discovery' }]
    this.source = new LocalDataSource(userList)
  }
  // using to change setting active
  public changeSettingActive(value) {
    this.settingActive = value
  }

  // using to open dialogue modal 
  openModalWithComponent(event) {
    event.preventDefault()
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './proposal.modal.html',
})
export class DialogContentExampleDialog {
  passwordform = new FormGroup({
    related: new FormControl(undefined, [Validators.required]),
    lead: new FormControl(undefined, [Validators.required])
  })
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
  ) { }

  // using to close opened dialogue model
  onClose(event): void {
    event.preventDefault()
    this.dialogRef.close();
  }
}

