import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { Campaign } from '../../campaign/campaign.model';
import { CampaignService } from '../../campaign/campaign.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {

  fName = new FormControl('', [Validators.required]);
  lName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  campaign = new FormControl('');
  roletype = new FormControl('');
  valForm: FormGroup;
  emailReg: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  campaignList: Campaign[];
  selectedCampId: string;
  roleselect: boolean = false;

  constructor(private translate: TranslateService, fb: FormBuilder, public _openIdConnectService: OpenIdConnectService, private campaignService: CampaignService, public route: ActivatedRoute,) {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;
    this.valForm = fb.group({

      'fName': [this.fName.value, Validators.required],
      'lName': [this.lName.value, Validators.required],
      'email': [this.email.value, [Validators.required, Validators.pattern(this.emailReg)]],
      'campaign': [this.campaign.value],
      'roletype': [this.roletype.value]
    })
      ;
    this.getCampaignList();
  }

  ngOnInit() {
  }

  public getCampaignList(): void {

    var userid = localStorage.getItem("userID");
    this.campaignService.getCampaign(userid).subscribe(res => {
      ;
      this.campaignList = res;
    })
  }

  onCampSelect(event) {
    this.roleselect = true;
  }
  submitForm(value: any) {

    ;
    var result: any = Object.assign({}, value);
    console.log(result);
  }

}
