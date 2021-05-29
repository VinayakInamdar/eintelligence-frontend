import { Component, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
import { CampaignService } from '../../campaign/campaign.service';
import { UserModel } from './usermodel';
const swal = require('sweetalert');

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
  listenerFn: () => void;
  colors = ["#EF9A9A",
    "#F48FB1",
    "#CE93D8",
    "#B39DDB",
    "#81D4FA",
    "#80CBC4",
    "#A5D6A7",
    "#C5E1A5",
    "#E6EE9C",
    "#FFCC80"];
  userid1: any;
  superAdmin; userId; companyId;
  id2: any; companyRole2: any;
  selectedUser: UserModel;
  UserList: Array<UserModel>;
  public roleList: Array<string> = [
  ];
  valForm: FormGroup;
  showLoadingIndicator: boolean = false;
  modalRef: BsModalRef;
  constructor(private renderer: Renderer2,
    private modalService: BsModalService,
    public openIdConnectService: OpenIdConnectService,
    private fb: FormBuilder,
    private router: Router,
    private campaignService: CampaignService,
    private actr: ActivatedRoute, public settingsservice: SettingsService) { }

  ngOnInit(): void {
    debugger;
    // Model Driven validation
    this.getAllUserList();




  }


  getAllUserList() {
    this.valForm = this.fb.group({
      'role': [null, Validators.required]
    })
    this.superAdmin = this.openIdConnectService.user.profile.super_admin;
    this.userId = this.openIdConnectService.user.profile.sub;
    this.companyId = this.settingsservice.selectedCompanyInfo.companyId;
    this.campaignService.getAllUsers(this.userId, this.companyId, this.superAdmin).subscribe((res: any) => {
      debugger;
      this.UserList = new Array<UserModel>();
      for (let u in res) {
        var staff = new UserModel();
        staff.entityID = res[u].id;
        staff.fName = res[u].fName;
        staff.lName = res[u].lName;
        staff.emailID = res[u].email;
        staff.color = this.getRandomColor();
        staff.EmailConfirmed = res[u].emailConfirmed;
        staff.CompanyRole = res[u].companyRole;
        this.UserList.push(staff);
      }
    });

  }
  goToInviteUser() {
    this.router.navigate(['user-list/invite-user']);
  }
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];;
  }




  onClick(value: any) {
    debugger;
    if (value == "Normal User") {
      this.roleList = ["Admin"];
    }
    else {
      this.roleList = ["Normal User", "Client User", "Admin"]
    }

  }
  onRoleChange(p: any, value: any) {
    debugger;
    this.userid1 = p.entityID;
    this.id2 = p.emailID;
    this.companyRole2 = value;
    debugger;


  }

  onRoleSelected(value: any) {
    debugger;

    var userId = this.userid1;
    var companyId: string = this.settingsservice.selectedCompanyInfo.companyId;
    var role = this.companyRole2;
    //Change Role

    this.campaignService.updateUserRole(userId, companyId, role).subscribe((res: any) => {
      debugger;
      if (res == true) {
        this.getAllUserList()
      }
    });
  }
}
