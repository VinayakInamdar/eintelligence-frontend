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
import { SettingsService } from 'src/app/core/settings/settings.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
@Directive({ selector: '[ng2FileSelect]' })

export class RegisterComponent implements OnInit {
  companytype = new FormControl('', [Validators.required]);
  cName = new FormControl(null, [Validators.required]);
  companyImageUrl = new FormControl('',[Validators.required]);
  valForm: FormGroup;
  // public registerModel: Register;
  public userModel: User;
  public userComponent: UserComponent;
  edit: boolean;
  public selectedCompanyImageUrl:string="";
  // public registerComponent: RegisterComponent;
  public value: any = {};

  sub: Subscription;
  id: number;
 
  textvalue: string = "";

  constructor(private translate: TranslateService, fb: FormBuilder, private registerService: RegisterService,
    public router: Router, public route: ActivatedRoute, public userService: UserService, public accountService: AccountService,public settingsservice:SettingsService) {

    // this.registerModel = new Register();
    this.userModel = new User();

    this.valForm = fb.group({

      'fName': [this.userModel.fName, Validators.required],
      'lName': [this.userModel.lName, Validators.required],
      'email': [this.userModel.email, Validators.required],
      'password': [this.userModel.password, Validators.required],
      'cName': [this.cName.value, Validators.required],
      'companytype': [this.companytype.value, Validators.required],
      'companyImageUrl':[this.companyImageUrl.value,Validators.required]
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
    this.selectedCompanyImageUrl = localStorage.getItem('companyImageUrl');
    localStorage.removeItem('companyImageUrl');
    debugger;
    value.companyImageUrl = this.selectedCompanyImageUrl;
    
    var result: User = Object.assign({}, value);
    this.userService.createUser(result).subscribe((res: User) => {
      
      this.userModel = res;


      var company = {
        "id": res.companyID,
        "companytype": this.valForm.controls.companytype.value,
        "name": this.valForm.controls.cName.value,
        "companyImageUrl": this.selectedCompanyImageUrl
      }


      this.accountService.updateCompany(res.companyID, company).subscribe(
        res => {
          console.log(res)
          
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
 
  getBase64(event:any){
    debugger;
    let companyImageUrl: string
    let me = this;
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      companyImageUrl=reader.result.toString();
    localStorage.setItem('companyImageUrl',companyImageUrl);
      
     
    };
    
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  
}
