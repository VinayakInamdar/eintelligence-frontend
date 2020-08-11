import { Component, OnInit, Directive, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { LocalDataSource } from 'ng2-smart-table';


const success = require('sweetalert');

@Component({
  selector: 'app-campagin',
  templateUrl: './campagin.component.html',
  styleUrls: ['./campagin.component.scss']
})
@Directive({ selector: '[ng2FileSelect]' })

export class CampaginComponent implements OnInit,AfterViewInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  valForm: FormGroup;
  public campaignModel: Campaign;
  edit: boolean;
  public value: any = {};

  sub: Subscription;
  id: number;
  public demo1TabIndex = 0;
  public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  url: string;
  selectedCampaignName:string;
  selectedCampId : string;
  campaignList: import("c:/Users/rahik/CoreFrontend_Techovarya(2)/eintelligence-frontend/src/app/routes/campaign/campaign.model").Campaign[];
  settings = {
    actions:{add: false, edit:false, delete:false},
    columns: {
      name: {
        title: 'name',
        filter: false
      },
      webUrl: {
        title: 'webUrl',
        filter: false
      },
      moreTraffic: {
        title: 'moreTraffic',
        filter: false
      },
      sales: {
        title: 'sales',
        filter: false
      },
      leadGeneration: {
        title: 'leadGeneration',
        filter: false
      }
    }
  };
  source: LocalDataSource;

  constructor(private translate: TranslateService,  fb: FormBuilder,
    private campaignService: CampaignService, 
     public route: ActivatedRoute, public router: Router) { 

      this.campaignModel = new Campaign();
      this.getCampaignList();
      

      this.valForm = fb.group({
        'name': [this.campaignModel.name, Validators.required],
        'webUrl': [this.campaignModel.webUrl,[Validators.required,Validators.pattern(this.myreg)]],
        'moreTraffic': [this.campaignModel.moreTraffic, Validators.required],   
        'sales': [this.campaignModel.sales, Validators.required],
        'leadGeneration': [this.campaignModel.leadGeneration, Validators.required],         
    })     
  }
  ngAfterViewInit(): void {
    this.url = this.router.url
    this.disableTab()
  }

     
  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
  });

  }

  public getCampaignList(): void {
    this.campaignService.getCampaign().subscribe(res => {
        this.campaignList = res; 
        this.source = new LocalDataSource(this.campaignList)            
    });
}
public onCampaignSelect(event,selectedCampaign) {
  this.selectedCampaignName = selectedCampaign.name
  this.selectedCampId = selectedCampaign.id
  this.router.navigate(['/campaign/overview', {id : this.selectedCampId}]);
  console.log(event,selectedCampaign)
}

// using to search user locally
onSearch(query: string = '') {
  if(query == "") {
    this.source = new LocalDataSource(this.campaignList)
  }
  else {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'name',
        search: query
      },
    ], false); 
    // second parameter specifying whether to perform 'AND' or 'OR' search 
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
  
}
  submitForm(value: any) {
    
    var result: Campaign = Object.assign({}, value);
    //  result.profilePicture = this.fileToUpload.name
    
    this.campaignService.createCampaign(result).subscribe((res: Campaign) => {
        this.campaignModel = res;
         //validation
         event.preventDefault();
         for (let c in this.valForm.controls) {
             this.valForm.controls[c].markAsTouched();
         }
         if (!this.valForm.valid) { 
             return;
         }
       
      });
  }
  goToNextTab(event,inputvalue,fieldName,tabid) {
    event.preventDefault()
    var value = this.validateForm(fieldName)
    
    if(value =='VALID') {
      this.staticTabs.tabs[tabid].disabled = false;
      this.staticTabs.tabs[tabid].active = true;
    }
  }
  validateForm(fieldName) {
    if (this.valForm.invalid) {
      this.valForm.get(fieldName).markAsTouched();
      var value1 = this.valForm.controls[fieldName].status
      return value1;
    }
  }

  goToPreviousTab(event,tabid){
    event.preventDefault()
    this.staticTabs.tabs[tabid].active = true;
  }
  selectTab(tabId: number) { 
    this.staticTabs.tabs[tabId].disabled = !this.staticTabs.tabs[tabId].disabled;
    this.staticTabs.tabs[tabId].active = true;
  }

  disableTab() {
    this.staticTabs.tabs[1].disabled = !this.staticTabs.tabs[1].disabled;
    this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled;
  }
  public demo1BtnClick() {
    const tabCount = 3;
    this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  }
  successAlert() {
    success({
        icon: this.translate.instant('sweetalert.SUCCESSICON'),
        title: this.translate.instant('message.INSERTMSG'),
        buttons: {
            confirm: {
                text: this.translate.instant('sweetalert.OKBUTTON'),
                value: true,
                visible: true,
                className: "bg-primary",
                closeModal: true,
            }
        }
    }).then((isConfirm: any) => {
        if (isConfirm) {
            this.router.navigate(['/home']);
        }
    });
}
userRowSelect(campaign: any) : void{

  this.router.navigate(['/campaign/overview', {id : campaign.data.id}]);
  
       
}
}
