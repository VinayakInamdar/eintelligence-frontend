import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../user.model';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserComponent } from '../user/user.component';
import { FileUploader } from 'ng2-file-upload';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

//const URL = 'environment.apiUrl';
const sweetAlert = require('sweetalert');
@Component({
    selector: 'app-user',
    templateUrl: './edituser.component.html',
    //styleUrls: ['./edituser.component.scss']
})
export class EditUserComponent implements OnInit {
    valForm: FormGroup;
    public userModel: User;
    edit: boolean;
    public userComponent: UserComponent;
    public value: any = {};
    sub: Subscription;
    id: string;

    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });

    constructor(private translate: TranslateService, fb: FormBuilder, private userService: UserService,
        public toasterService: ToasterService, public route: ActivatedRoute, public router: Router) {

        this.userModel = new User();
        console.log(this.route.params.subscribe());
        this.valForm = fb.group({
            'fName': [this.userModel.fName, Validators.required],
            'lName': [this.userModel.lName, Validators.required],
            'email': [this.userModel.email, Validators.required],            
        })   

    }


    public ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.userService.getUserById(this.id).subscribe(res => {

            this.userModel = res;
        });
        
    }
    submitForm(value: User) {
        var result: User = Object.assign({}, value);
        // result.profilePicture = this.fileToUpload.name;        
        //Update User List
        this.userService.updateUser(this.id, this.userModel).subscribe((res: User) => {

            this.userModel = res;
            //validation
            event.preventDefault();
            for (let c in this.valForm.controls) {
                this.valForm.controls[c].markAsTouched();
            }
            if (this.valForm.valid) { }

            //Toaster
            this.toaster = {
                type: this.translate.instant('toaster.success.TYPE'),
                title: this.translate.instant('toaster.success.TITLE'),
                text: this.translate.instant('message.UPDATEMSG'),
            };
            this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);
            this.updateAlert();

        });
    }
    
    // Show Successfully Delete message
    deleteUserById(id: number) {
        sweetAlert({
            title: this.translate.instant('sweetalert.TITLE'),
            text: this.translate.instant('sweetalert.TEXT'),
            icon: this.translate.instant('sweetalert.WARNINGICON'),
            buttons: {
                cancel: {
                    text: this.translate.instant('sweetalert.CANCELBUTTON'),
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: false
                },
                confirm: {
                    text: this.translate.instant('sweetalert.CONFIRMBUTTON'),
                    value: true,
                    visible: true,
                    className: "bg-danger",
                    closeModal: false
                }
            }
        }).then((isConfirm) => {
            if (isConfirm) {
                //toaster
                this.toaster = {
                    type: this.translate.instant('toaster.success.TYPE'),
                    title: this.translate.instant('toaster.success.TITLE'),
                    text: this.translate.instant('message.DELETEMSG'),
                };
                this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);               
            }
            else {
                sweetAlert('Cancelled', this.translate.instant('sweetalert.CANCELTEXT'), 'error');
            }
        });

    };
    //Show Successfully Update message
    updateAlert() {
        sweetAlert({
            icon: this.translate.instant('sweetalert.SUCCESSICON'),
            title: this.translate.instant('message.UPDATEMSG'),
            buttons: {
                confirm: {
                    text: this.translate.instant('sweetalert.OKBUTTON'),
                    value: true,
                    visible: true,
                    className: "bg-primary",
                    closeModal: true,
                }
            }
        }).then((isConfirm) => {
            if (isConfirm) {
                this.router.navigate(['/user']);

            }
        });
    }
}
