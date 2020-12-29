import { Component, OnInit, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import { Register } from '../register.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RegisterService } from '../register.service';
import { User } from '../../user/user.model';
import { UserComponent } from '../../user/user/user.component';
import { UserService } from '../../user/user.service';
import { AccountService } from '../../account/account.service';
import { CompanyInformation } from '../../account/account/companyinformation.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
@Directive({ selector: '[ng2FileSelect]' })

export class RegisterComponent implements OnInit {
  companytype = new FormControl('', [Validators.required]);
  cName = new FormControl(null, [Validators.required]);
  valForm: FormGroup;
  // public registerModel: Register;
  public userModel: User;
  public userComponent: UserComponent;
  edit: boolean;
  // public registerComponent: RegisterComponent;
  public value: any = {};

  sub: Subscription;
  id: number;

  textvalue: string = "";

  constructor(private translate: TranslateService, fb: FormBuilder, private registerService: RegisterService,
    public router: Router, public route: ActivatedRoute, public userService: UserService, public accountService: AccountService) {

    // this.registerModel = new Register();
    this.userModel = new User();

    this.valForm = fb.group({

      'fName': [this.userModel.fName, Validators.required],
      'lName': [this.userModel.lName, Validators.required],
      'email': [this.userModel.email, Validators.required],
      'password': [this.userModel.password, Validators.required],
      'cName': [this.cName.value, Validators.required],
      'companytype': [this.companytype.value, Validators.required]
    })
  }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

  submitForm(value: any) {
    // var result: Register = Object.assign({}, value);

    // this.registerService.createRegiter(result).subscribe((res: Register) => {
    //   this.registerModel = res;
    // });
    debugger
    var result: User = Object.assign({}, value);
    this.userService.createUser(result).subscribe((res: User) => {
      debugger
      this.userModel = res;


      var company = {
        "id": res.companyID,
        "companytype": this.valForm.controls.companytype.value,
        "name": this.valForm.controls.cName.value
      }


      this.accountService.updateCompany(res.companyID, company).subscribe(
        res => {
          console.log(res)
          debugger
        }
      )

    });
  }
  public onClick(): any {
    this.router.navigate(['/success']);
  }
  public goToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy'])
  }
  public goToTermsAndConditions() {
    this.router.navigate(['/terms-and-conditions'])
  }
}
