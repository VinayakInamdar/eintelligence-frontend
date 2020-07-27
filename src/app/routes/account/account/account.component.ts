import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
declare var $: any;

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

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required])
  });
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


  constructor(public router: Router) { 
    this.changeText = false;
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

  ngOnInit(): void {
    $('#summernote').summernote({
      height: 280,
      dialogsInBody: true,
      callbacks: {
          onChange: (contents, $editable) => {
              this.contents = contents;
              // console.log(contents);
          }
      }
  });

   // Hide the initial popovers that display
   $('.note-popover').css({
    'display': 'none'
});

  }

  
  //   // public onClick(): any {
  //   //   this.router.navigate(['/account/branding']);
  //   // }
}
