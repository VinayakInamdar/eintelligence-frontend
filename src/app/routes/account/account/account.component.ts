import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO, NgxIntlTelInputComponent } from 'ngx-intl-tel-input';
import { CompanyInformation } from './companyinformation.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../account.service';
import { strict } from 'assert';
import { TranslateService } from '@ngx-translate/core';
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';
declare var $: any;

const success = require('sweetalert');
// Tooltips fix for summernote
// https://github.com/Financial-Times/polyfill-library/issues/164#issuecomment-486977672
const origToString = Object.prototype.toString;
Object.prototype.toString = function() {
    'use strict';
    if (this === null) return '[object Null]';
    return origToString.call(this);
};
// End Tooltips fix for summernote

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
 
  @ViewChild('ngxintlbil', { static: false }) ngxintlbil: NgxIntlTelInputComponent;
  @ViewChild('ngxintlcom', { static: false }) ngxintlcom: NgxIntlTelInputComponent;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  maxHeight = window.innerHeight/1;
  isCollapsed = true;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  
  companyInfoForm = new FormGroup({
    name: new FormControl(undefined, [Validators.required]),
    website: new FormControl(undefined, [Validators.required]),
    phone: new FormControl(undefined, [Validators.required]),
    email: new FormControl(undefined),
    timezone: new FormControl(undefined, [Validators.required]),
    address: new FormControl(undefined, [Validators.required]),
    zipCode: new FormControl(undefined, [Validators.required]),
    city: new FormControl(undefined, [Validators.required]),
    state: new FormControl(undefined, [Validators.required]),
    country: new FormControl(undefined, [Validators.required]),
    description: new FormControl(undefined, [Validators.required]),
    
  });
  profileInfo = new FormGroup({
    fName: new FormControl(undefined, [Validators.required]),
    lName: new FormControl(undefined, [Validators.required]),
    email: new FormControl(undefined, [Validators.required]),
    phoneNumber: new FormControl(undefined, [Validators.required]),
})
billingInfo = new FormGroup({
  name: new FormControl(undefined, [Validators.required]),
  website: new FormControl(undefined, [Validators.required]),
  phone: new FormControl(undefined, [Validators.required]),
  email: new FormControl(undefined),
  address: new FormControl(undefined, [Validators.required]),
  zipCode: new FormControl(undefined, [Validators.required]),
  city: new FormControl(undefined, [Validators.required]),
  state: new FormControl(undefined, [Validators.required]),
  country: new FormControl(undefined, [Validators.required]),
  description: new FormControl(undefined, [Validators.required]),
})
brandingInfoForm = new FormGroup({
  branding : new FormControl(undefined,[Validators.required])
})
emailSettingsForm = new FormGroup({
  emailAdd:new FormControl(undefined,[Validators.required]),
  emailSign:new FormControl(undefined,[Validators.required])
})
  settingActive = 1;

  //For Company Information state selection dropdown
  public state: Array<string> = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Byram', 'California',
    'Cokato', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Lowa', 'Maine', 'Maryland',
    'Massachusetts', 'Medfield', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Ontario', 'Oregon', 'Pennsylvania', 'Ramey', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Sublimity', 'Tennessee', 'Texas', 'Trimble', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  changeText: boolean;
  companyinformation: any;
  user:any;

  //state dropdown list refresh
  public refreshValue(value: any): void {
    this.value = value;
  }
  public value: any = {};

  //For Company Information Time Zone selection dropdown
  public time: Array<string> = ['(GMT -12:00) Eniwetok,Kwajalein', '(GMT -11:00) Midway Island,samoa',
    '(GMT -10:00) Hawaii', '(GMT -9:00) Alaska', '(GMT -8:00) Pacific Time (Us & Canada)', '(GMT -7:00) Mountain Time (Us & Canada)',
    '(GMT -6:00) Central Time (Us & Canada), Mexico City', '(GMT -5:00) Eastern Time (Us & Canada), Bogoto, Lima',
    '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz', '(GMT -3:30) Newfoundland', '(GMT -3:00) Brazil, Buenos Aires, Georgetown',
    '(GMT -2:00) Mid-Atlantic', '(GMT -1:00 hour) Azores, Cape Verde Islands', '(GMT) Western Europe Time, Londone, Lisbon, Casablanca',
    '(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris', '(GMT +2:00) Kaliningrad, South Africa',
    '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg', '(GMT +3:30) Tehran', '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
    '(GMT +4:30) Kabul', '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
    '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi', '(GMT +5:45) Kathmandu', '(GMT +6:00) Almaty, Dhaka, Colombo',
    '(GMT +7:00) Bangkok, Hanoi, Jakarta', '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
    '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk', '(GMT +9:30) Adelaide, Darwin',
    '(GMT +10:00) Eastern Australia, Guam, Vladivostok', '(GMT +11:00) Magadan, Solomon Island, New Caledonia',
    '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka', '(GMT +6:30) Yangon (Rangoon)',
    '(GMT +8:45) Eucla', '(GMT +10:30) Lord Howe Island', '(GMT +11:30) Norfolk Island',
    '(GMT +12:45) Chatham Island', '(GMT +13:00) Nukualofa', '(GMT +14:00) Kiritimati',
    '(GMT -9:30) Marquesas Islands', '(GMT -4:30) Caracas'];

  //For Company Information Country selection dropdown
  public country: Array<string> = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'American Samoa', 'Angola', 'Anguilla', 'Anguilla',
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
    'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory',
    'Brunei Darussalarm', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
    'Cape Verde', 'Cayman Island', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island',
    'Cocos (Keeling) Island', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote DIvoire',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)',
    'Faroe Islands', 'Fiji', 'Finland', 'France', 'France, Metropolitan', 'French Guiana', 'French Polynesia',
    'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece',
    'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-bissau', 'Guyana',
    'Haiti', 'Heard and Mc Donald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India',
    'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Democratic Peoples Republic of', 'Korea, Republic of',
    'Kuwait', 'Kyrgyzstan', 'Lao Peoples Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
    'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia, The Former Yugoslav Republic of',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique',
    'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of',
    'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
    'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama',
    'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico',
    'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
    'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
    'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia (Slovak Republic)', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'Spain', 'Sri Lanka', 'St. Helena',
    'St. Pierre and Miquelon', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen Islands', 'Swaziland',
    'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania, United Republic of',
    'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
    'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City State (Holy See)', 'Venezuela', 'Viet Nam', 'Virgin Islands (British)', 'Virgin Islands (U.S.)',
    'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe',
    'Global', 'Timor Leste', 'Jersey', 'Isle of Man', 'Catalan Linguistic', 'Serbia', 'Guernsey', 'Palestine',
    'Montenegro', 'Congo Democratic'];


  constructor(private translate: TranslateService,public router: Router,public dialog: MatDialog,private accountService: AccountService, private openIdConnectService: OpenIdConnectService) { 
    this.changeText = false;
    this.getCompany();
    this.getUser();
    
  }

  public itemsCategories: Array<string> = ['coding', 'less', 'sass', 'angularjs', 'node', 'expressJS'];
  public itemsTags: Array<string> = ['JAVASCRIPT', 'WEB', 'BOOTSTRAP', 'SERVER', 'HTML5', 'CSS'];
  public itemsReview = [
    'Adam <adam@email.com>',
    'Amalie <amalie@email.com>',
    'Wladimir <wladimir@email.com>',
    'Samantha <samantha@email.com>',
    'Estefanía <estefanía@email.com>',
    'Natasha <natasha@email.com>',
    'Nicole <nicole@email.com>',
    'Adrian <adrian@email.com>'
  ];
  valueCategory;
  valueTag;
  valueReview;
  contents: string;
  CompanyID : string;

  ngOnInit(): void {
    $('#summernote').summernote({
      height: 280,
      dialogsInBody: true,
      callbacks: {
          onChange: (contents, $editable) => {
              this.contents = contents;

          }
      }
  });
  

   // Hide the initial popovers that display
   $('.note-popover').css({
    'display': 'none'
});



  }



  getUser() {

    var userId = this.openIdConnectService.user.profile.sub;
    this.accountService.getUser(userId).subscribe(
      res1=>{
        console.log(res1);
        for (let c in this.profileInfo.controls) {
          this.profileInfo.controls[c].setValue(res1[c])
      }
                      
        
      }
    )
  }

  getCompany() {

    var userId = this.openIdConnectService.user.profile.sub;
    this.accountService.getCompany(userId).subscribe(
      res=>{
        console.log(res)
        
        for (let c in this.companyInfoForm.controls) {
          this.companyInfoForm.controls[c].setValue(res[c])
      }
      for (let c in this.brandingInfoForm.controls) {
        this.brandingInfoForm.controls[c].setValue(res[c])
    }
        
        this.companyinformation = res
        this.CompanyID = this.companyinformation.companyID;
      }
    )
  }
  
  openFile(){

    document.querySelector('input').click()
  }
  handle(e){

  }
  public openAttachment(filepicker) {
    document.getElementById(filepicker).click();
  }
  public fileChangeEvent(fileInput: any,type){
    var filetype = "";
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e : any) {
        if(type == "img"){
           filetype = "#previewimg"
        }
        else {
          filetype = "#previewlogo"
        }
          $(filetype).attr('src', e.target.result);
      }

      reader.readAsDataURL(fileInput.target.files[0]);
  }
}
  public setAsCompanyInformation(value){
    if(value){
      for (let c in this.billingInfo.controls) {
        if(c == "phone"){
          var value = this.companyInfoForm.controls.phone.value.number
          this.ngxintlbil.selectedCountry = this.ngxintlcom.selectedCountry
          this.billingInfo.controls.phone.setValue(value)  
        }
        else {
          this.billingInfo.controls[c].setValue(this.companyInfoForm.controls[c].value);
        }

    }
    }
    else {
      for (let c in this.billingInfo.controls) {
        if(c == "phone"){
          var value = null;
          this.ngxintlbil.selectedCountry = this.ngxintlcom.selectedCountry
          this.billingInfo.controls.phone.setValue(value)  
        }
        this.billingInfo.controls[c].setValue(undefined);
    }
    }
  
  }
  submitForm(value: any,formtype: string) {
    
    var result = Object.assign({}, value);
     if(this.settingActive == 1){
      if(formtype == "companyInfoForm"){
        //if(this.companyInfoForm.valid){
          debugger
          result['id'] = this.CompanyID;
          result['name'] = result.name
          result['description'] = result.description
          result['phone'] = result.phone['internationalNumber']
          this.companyinformation = result
          this.companyinformation['branding'] = this.brandingInfoForm.controls['branding'].value
          this.accountService.updateCompany(this.CompanyID,this.companyinformation).subscribe(
            res=>{
              console.log(res)
              this.successAlert()
            }
          )
        //}
        // else {
        //   for (let c in this.companyInfoForm.controls) {
        //     this.companyInfoForm.controls[c].markAsTouched();
        // }
        // }
      
   
      }
      else if (formtype == "profileinfoform") {
        if(this.companyInfoForm.valid){
          
          var userid = this.openIdConnectService.user.profile.sub;
          result['fName'] = result.fName
          result['lName'] = result.lName
          result['email'] = result.email
          result['phoneNumber'] = result.phoneNumber['internationalNumber']
          this.user = result
         
          this.accountService.updateUser(userid,this.user).subscribe(
            res=>{
              console.log(res)
              this.successAlert()
            }
          )
        }else{
          for (let c in this.profileInfo.controls) {
            this.profileInfo.controls[c].markAsTouched();
        }
        }
       
      }
      else {
        for (let c in this.billingInfo.controls) {
          this.billingInfo.controls[c].markAsTouched();
      }
      }
    }
    else if(this.settingActive == 2){
      if(formtype == "brandingInfoForm"){
        if(this.brandingInfoForm.valid){
        
          this.companyinformation['branding'] = value.branding
          this.accountService.updateCompany(this.CompanyID,this.companyinformation).subscribe(
            res=>{
              console.log(res)
              this.successAlert()
            }
          )
        }
        else {
          for (let c in this.companyInfoForm.controls) {
            this.companyInfoForm.controls[c].markAsTouched();
        }
        }
      
   
      }
      else if (formtype == "profileinfoform") {
        for (let c in this.profileInfo.controls) {
          this.profileInfo.controls[c].markAsTouched();
      }
      }
      else {
        for (let c in this.billingInfo.controls) {
          this.billingInfo.controls[c].markAsTouched();
      }
      }
    }
    else if(this.settingActive == 3){
      if(formtype == "emailSettingsForm"){
        if(this.emailSettingsForm.valid){
          
          result['Id'] = this.CompanyID;
          result['email'] = value.emailAdd
          // this.accountService.updateCompany(companyId,result).subscribe(
          //   res=>{
          //     console.log(res)
          //     this.successAlert()
          //   }
          // )
        }
        else {
          for (let c in this.companyInfoForm.controls) {
            this.companyInfoForm.controls[c].markAsTouched();
        }
        }
      
   
      }
      else if (formtype == "profileinfoform") {
        for (let c in this.profileInfo.controls) {
          this.profileInfo.controls[c].markAsTouched();
      }
      }
      else {
        for (let c in this.billingInfo.controls) {
          this.billingInfo.controls[c].markAsTouched();
      }
      }
    }
    else if(this.settingActive == 4){
      if(formtype == "companyInfoForm"){
        if(this.companyInfoForm.valid){
      
          result['Id'] = this.CompanyID;
          result['name'] = result.name
          result['description'] = result.description
          result['phone'] = result.phone['internationalNumber']
          this.accountService.updateCompany(this.CompanyID,result).subscribe(
            res=>{
              console.log(res)
              this.successAlert()
            }
          )
        }
        else {
          for (let c in this.companyInfoForm.controls) {
            this.companyInfoForm.controls[c].markAsTouched();
        }
        }
      
   
      }
      else if (formtype == "profileinfoform") {
        for (let c in this.profileInfo.controls) {
          this.profileInfo.controls[c].markAsTouched();
      }
      }
      else {
        for (let c in this.billingInfo.controls) {
          this.billingInfo.controls[c].markAsTouched();
      }
      }
    }
    
  }
    // using to open sweetalert to show success dialog
    successAlert() {
      success({
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
      }).then((isConfirm: any) => {
        if (isConfirm) {
          // this.router.navigate(['/home']);
        }
      });
    }
  openModalWithComponent(event) {
    event.preventDefault()
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  public changeSettingActive(event,value) {
    this.settingActive = value
    for (let c in this.companyInfoForm.controls) {
      this.companyInfoForm.controls[c].setValue(this.companyinformation[c])
  }
  }

  

}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './account.modal.html',
})
export class DialogContentExampleDialog {
  passwordform = new FormGroup({
    password : new FormControl(undefined,[Validators.required])
  })
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    ) {}
    onClose(event): void {
      event.preventDefault()
      this.dialogRef.close();
    }
  submitForm(value: any,){
    var result: CompanyInformation = Object.assign({}, value);
    for (let c in this.passwordform.controls) {
      this.passwordform.controls[c].markAsTouched();
  }
  }
}
