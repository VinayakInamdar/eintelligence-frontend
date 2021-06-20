import { Component, OnInit, ViewChild, Directive } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserComponent } from '../user/user.component';
import { FileUploader } from 'ng2-file-upload';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';



const sweetAlert = require('sweetalert');
//const URL = 'environment.apiUrl';

@Component({
    selector: 'app-user',
    templateUrl: './createuser.component.html',
    styleUrls: ['./createuser.component.scss'],
})

export class CreateUserComponent implements OnInit {

    //user:User;
    valForm: FormGroup;
    public userModel: User;
    edit: boolean;
    public userComponent: UserComponent;
    public value: any = {};

    sub: Subscription;
    id: number;

    textvalue: string = "";

    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });
    textvalue1: string;
    textvalue2: string;



    constructor(private translate: TranslateService,  fb: FormBuilder,
        private userService: UserService,  public toasterService: ToasterService,
         public route: ActivatedRoute, public router: Router) {

        this.userModel = new User();

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

    }

    submitForm(value: any) {

        var result: User = Object.assign({}, value);
        //  result.profilePicture = this.fileToUpload.name

        this.userService.createUser(result).subscribe((res: User) => {
            this.userModel = res;

             //validation
            event.preventDefault();
            for (let c in this.valForm.controls) {
                this.valForm.controls[c].markAsTouched();
            }
            if (!this.valForm.valid) {
                return;
            }
            //Toaster
            this.toaster = {
                type: this.translate.instant('toaster.success.TYPE'),
                title: this.translate.instant('toaster.success.TITLE'),
                text: this.translate.instant('message.CREATEMSG'),
            };
            this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);
            this.SuccessAlert();
        });

    }

    SuccessAlert() {
        sweetAlert({
            icon: this.translate.instant('sweetalert.SUCCESSICON'),
            title: this.translate.instant('message.INSERTMSG'),
            buttons: {
                confirm: {
                    text: this.translate.instant('sweetalert.OKBUTTON'),
                    value: true,
                    visible: true,
                    className: "bg-danger",
                    closeModal: true,
                }
            }
        }).then((isConfirm: any) => {
            if (isConfirm) {
                this.router.navigate(['/user']);
            }
        });
    }
}
