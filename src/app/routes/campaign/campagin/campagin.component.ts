import { Component, OnInit, Directive } from '@angular/core';
import * as _ from 'lodash';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';


const success = require('sweetalert');

@Component({
  selector: 'app-campagin',
  templateUrl: './campagin.component.html',
  styleUrls: ['./campagin.component.scss']
})
@Directive({ selector: '[ng2FileSelect]' })

export class CampaginComponent implements OnInit {

  valForm: FormGroup;
  public campaignModel: Campaign;
  edit: boolean;
  public value: any = {};

  sub: Subscription;
  id: number;
 

  constructor(private translate: TranslateService,  fb: FormBuilder,
    private campaignService: CampaignService, 
     public route: ActivatedRoute, public router: Router) { 

      this.campaignModel = new Campaign();

      this.valForm = fb.group({
        'name': [this.campaignModel.name, Validators.required],
        'webUrl': [this.campaignModel.webUrl,Validators.required],
        'moreTraffic': [this.campaignModel.moreTraffic, Validators.required],   
        'sales': [this.campaignModel.sales, Validators.required],
        'leadGeneration': [this.campaignModel.leadGeneration, Validators.required],         
    })     
  }

     
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
  });
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
}
