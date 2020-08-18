import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'custom-component',
    templateUrl: './badge.component.html',
    styleUrls: ['./audits.component.scss']
  })
  export class AuditBadge implements OnInit {
  
  
   @Input() rowData: any;
   gradeData:string = 'A';
  
   @Output() save: EventEmitter<any> = new EventEmitter();
   ngOnInit(): void {
    // this.gradeData = this.rowData.grade
  }
  
  }