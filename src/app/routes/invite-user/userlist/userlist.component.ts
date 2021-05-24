import { Component, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  selectedUser: UserModel;
  UserList: Array<UserModel>;
  public roleList: Array<string> = [
    "Admin", "Client User", "Normal User"];
  valForm: FormGroup;
  showLoadingIndicator: boolean = false;
  modalRef: BsModalRef;
  constructor(private renderer: Renderer2,
    private modalService: BsModalService,
    public openIdConnectService: OpenIdConnectService,
    private fb: FormBuilder,
    private router: Router,
    private campaignService: CampaignService,
    private actr: ActivatedRoute) { }

  ngOnInit(): void {

    // Model Driven validation
    this.valForm = this.fb.group({
      'role': [null, Validators.required]
    })
    var superAdmin = this.openIdConnectService.user.profile.super_admin;
    var userId = this.openIdConnectService.user.profile.sub;
    var companyId = localStorage.getItem('companyID')
    this.campaignService.getAllUsers(userId, companyId, superAdmin).subscribe((res: any) => {
      this.UserList = new Array<UserModel>();
      for (let u in res) {
        var staff = new UserModel();
        staff.entityID = res[u].id;
        staff.fName = res[u].fName;
        staff.lName = res[u].lName;
        staff.emailID = res[u].email;
        staff.color = this.getRandomColor();
        staff.EmailConfirmed = res[u].emailConfirmed;
        this.UserList.push(staff);
      }
    });

    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      var ele = <Element>e.target;
      if (!ele.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
      else {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.id == ele.id) {
            // do nothing
            openDropdown.classList.toggle("show");

          }
          else {
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }

        }
      }
    });

  }

  goToInviteUser() {
    this.router.navigate(['user-list/invite-user']);
  }
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];;
  }

  // model for change user role
  changeAccessShow(user: UserModel, template: TemplateRef<any>) {
    this.selectedUser = user;
    this.valForm = this.fb.group({
      'role': [null, Validators.required]
    })

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.showLoadingIndicator = true;
      swal({
        title: 'Are you sure to change access for',
        text: this.selectedUser.fName + " " + this.selectedUser.lName,
        icon: 'warning',
        buttons: {
          cancel: {
            text: 'No',
            value: null,
            visible: true,
            className: "",
            closeModal: true
          },
          confirm: {
            text: 'Yes',
            value: true,
            visible: true,
            className: "btn btn-raised btn-primary",
            closeModal: false
          }
        }
      }).then((isConfirm) => {
        if (isConfirm) {

          var userId = this.openIdConnectService.user.profile.sub;
          var companyId = localStorage.getItem('companyID')

          //Change Role
          this.campaignService.updateUserRole(userId, companyId, value.role).subscribe((res: any) => {
            swal({
              title: 'Access Changed!',
              text: "New role is " + value.role,
              icon: 'success',
              buttons: {
                cancel: {
                  text: 'OK',
                  value: null,
                  visible: true,
                  className: "btn btn-raised btn-primary",
                  closeModal: true
                }
              }
            })
            this.showLoadingIndicator = false;
            this.modalRef.hide();
          })
        }
        else {
          swal({
            title: 'Cancelled',
            icon: 'error',
            buttons: {
              cancel: {
                text: 'OK',
                value: null,
                visible: true,
                className: "btn btn-raised btn-primary",
                closeModal: true
              }
            }
          });
          this.showLoadingIndicator = false;
          this.modalRef.hide();
        }
      });
    }
  }

}
