import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '../../campaign/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IntegrationsService } from '../../integrations/integrations.service';
import { OverviewService } from '../../overview/overview.service';
import { PlatformLocation } from '@angular/common';
import { Campaign } from '../../campaign/campaign.model';
import { ChartDataSets, ChartOptions, ChartScales } from 'chart.js';
import { Label, Color, BaseChartDirective, ThemeService } from 'ng2-charts';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SerpDto } from '../serp.model';
import { find, pull, result } from 'lodash';
import { forkJoin, from } from 'rxjs';
const success = require('sweetalert');
import { country } from '../countrydata';
@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild('tagInput') tagInputRef: ElementRef;

  countriesList: any = country;

  isoCode: any;
  cities = [];
  state = [];
  tags: string[] = [];
  showSpinner: boolean = false;
  selectedCampaignName: string;
  selectedCampId: string;
  hovered: string = '';
  valForm: FormGroup;
  serpList: SerpDto[]
  campaignList: Campaign[];
  queryParams: string;
  settings = {
    actions: {
      columnTitle: '',
      custom: [
        { name: 'deleteKeyword', title: '<span class="text-danger col" style="padding-left:1rem"><i class="fas fa-trash-alt"></i></span>' }],
      add: false, edit: false, delete: false, position: 'right'
    },
    columns: {
      keywords: {
        title: 'KEYWORD PHRASE',
        filter: false
      },
      tags: {
        title: 'TAGS',
        filter: false
      },
      position: {
        title: 'POSITION',
        filter: false
      },
      searches: {
        title: 'SEARCHES',
        valuePrepareFunction: (searches) => {

          return this.convertToShortNumber(searches)
        },
        filter: false
      },
      location: {
        title: 'LOCATIONS',
        filter: false
      }
    }
  };
  source: LocalDataSource;

  bsValue = new Date();
  date = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split("T")[0]; campaignModel: Campaign;
  url: string;
  selectedLocation: any;
  ;
  endDate = new Date().toISOString().split("T")[0];;
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  ranges = [{
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
    label: 'Last 7 Days'
  }, {
    value: [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()],
    label: 'Last 30 Days'
  }, {
    value: [new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1), new Date(this.date.getFullYear(), this.date.getMonth() - 1, 31)],
    label: 'Last Month'
  }, {
    value: [new Date(this.date.getFullYear(), this.date.getMonth(), 1), new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)],
    label: 'This Month'
  },
  {
    value: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))],
    label: 'Next 7 Days'
  }];
  dateLabels: any;
  selectedLabel: number = 0;
  selctedLabelName: string = 'Sessions';
  selectedLabelValue: string = 'sessions'
  selectedLabel1: number;
  selctedLabelName1: string = 'Select Matrix';
  selectedLabelValue1: string;
  dropdownlabels: any = [
    { id: 0, label: 'Sessions', value: 'sessions' },
    { id: 1, label: 'Users', value: 'users' },
    { id: 2, label: 'New Sessions', value: 'percentNewSessions' },
    { id: 3, label: 'Bouncerate', value: 'bounceRate' },
    { id: 4, label: 'Pageviews', value: 'pageviews' },
    { id: 5, label: 'Pages/Sessions', value: 'pageviewsPerSession' },
    { id: 6, label: 'Avg Sess. Duration', value: 'avgSessionDuration' },
    { id: 7, label: 'Goal Completio', value: 'goalCompletionsAll' },
    { id: 8, label: 'Conversation Rate', value: 'goalConversionRateAll' }
  ]
  dropdownlabels1: any = [
    { id: 0, label: 'Sessions', value: 'sessions' },
    { id: 1, label: 'Users', value: 'users' },
    { id: 2, label: 'New Sessions', value: 'percentNewSessions' },
    { id: 3, label: 'Bouncerate', value: 'bounceRate' },
    { id: 4, label: 'Pageviews', value: 'pageviews' },
    { id: 5, label: 'Pages/Sessions', value: 'pageviewsPerSession' },
    { id: 6, label: 'Avg Sess. Duration', value: 'avgSessionDuration' },
    { id: 7, label: 'Goal Completio', value: 'goalCompletionsAll' },
    { id: 8, label: 'Conversation Rate', value: 'goalConversionRateAll' }
  ]
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Sessions', borderCapStyle: 'square' },
  ];

  lineChartLabels: Label[] = [];


  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 15
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    }

  };

  lineChartColors: Color[] = [
    {
      borderColor: '#2D9EE2',
      backgroundColor: 'rgba(12, 162, 235, 0.2)',
      pointBorderColor: '#2D9EE2',
      pointBackgroundColor: 'white'
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  showdiv: boolean = false;
  show: string = 'undefine';
  bsInlineRangeValue: Date[];
  settingActive: number = 0;

  constructor(private translate: TranslateService, fb: FormBuilder,
    private campaignService: CampaignService,
    public route: ActivatedRoute, public router: Router, private integrationsService: IntegrationsService
    , private overvieswService: OverviewService, location: PlatformLocation) {

    this.campaignModel = new Campaign();
    this.bsInlineRangeValue = [new Date(new Date().setDate(new Date().getDate() - 31)), new Date()];
    this.getCampaignList();
    this.getSerpList();
    if (this.router.url.includes('/keywords')) {
      this.url = this.router.url
      this.showDiv(event, 'true', 'seo')
      this.hovered = 'seo_keyword'
    }
    location.onPopState(() => {


    });


    this.valForm = fb.group({
      'keyword': [this.campaignModel.name, Validators.required],
      'location': [this.campaignModel.webUrl, Validators.required],
      'tag': [this.campaignModel.moreTraffic, Validators.required],
    })
  }
  ngAfterViewInit(): void {
    // // using to disable tab , user have to go step by step 
    // this.disableTab()
  }


  ngOnInit(): void {
    
    // this.getSerpLocations();
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    if (this.route.snapshot.queryParams.view !== undefined) {
      this.deleteQueryParameterFromCurrentRoute()
    }

  }

  deleteQueryParameterFromCurrentRoute() {
    var params = { ...this.route.snapshot.queryParams };
    this.queryParams = params.view
    delete params.view;
    this.router.navigate([], { queryParams: params });
    this.settingActive = 1;
  }
  // using to get campaignList
  public getCampaignList(): void {
    var userid = localStorage.getItem("userID");
    this.campaignService.getCampaign(userid).subscribe(res => {

      this.campaignList = res;
      var name = "";
      if (this.selectedCampId == ":id") {
        this.selectedCampId = this.campaignList[0].id
      }
      this.campaignList.map((s, i) => {
        if (s.id == this.selectedCampId) {
          name = s.name
        }
      })
      this.selectedCampaignName = name !== "" ? name : undefined;
    });
  }
  private getFilterOptionPlans() {
    return {
      pageNumber: 1,
      pageSize: 1000,
      fields: '',
      searchQuery: '',
      orderBy: ''
    }

  }
  // using to get list of keyword list
  public getSerpList(): void {
    const filterOptionModel = this.getFilterOptionPlans();
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id.substring(3)}`;
    filterOptionModel.searchQuery = 'CampaignID=="' + this.selectedCampId + '"'
    this.campaignService.getSerpForKeyword(filterOptionModel, "&tbs=qdr:m").subscribe(res => {
      this.serpList = res;
      this.source = new LocalDataSource(this.serpList)
    });
  }

  // using to change serp list with changing campaign from dropdown

  public onCampaignSelect(event, selectedCampaign) {
    this.selectedCampaignName = selectedCampaign.name
    this.selectedCampId = selectedCampaign.id
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`])
    this.getSerpList()
  }

  // using to search keywords locally
  onSearch(query: string = '') {
    if (query == "") {
      this.source = new LocalDataSource(this.serpList)
    }
    else {
      this.source.setFilter([
        // fields we want to include in the search
        {
          field: 'keywords',
          search: query
        },
      ], false);
      // second parameter specifying whether to perform 'AND' or 'OR' search 
      // (meaning all columns should contain search query or at least one)
      // 'AND' by default, so changing to 'OR' by setting false here
    }

  }

  // using to add new keyword in db

  submitForm(value: any) {
    value.location_name=this.current_loc_name;
    value.location=this.current_loc_code;
    var keywordDto = {
      CampaignID: '',
      Keyword: '',
      Location: '',
      LocationName:''
      //Tags: []
    }
    
    var result: SerpDto = Object.assign({}, value);
    keywordDto.CampaignID = this.selectedCampId
    keywordDto.Keyword = result['keyword'].split('\n')
    keywordDto.Location = result['location']
    keywordDto.LocationName=result['location_name']
   // keywordDto.Tags = this.tags
    this.showSpinner = true

    this.campaignService.addNewKeyword(keywordDto.CampaignID, keywordDto.Keyword, keywordDto.Location, keywordDto.LocationName,'').subscribe((res) => {
      event.preventDefault();
      this.showSpinner = false
      this.successAlert()


    });
  }

  // using to go to next tab

  goToNextTab(event, inputvalue, fieldName, tabid) {
    event.preventDefault()
    var value = this.validateForm(fieldName)

    if (value == 'VALID') {
      this.staticTabs.tabs[tabid].disabled = false;
      this.staticTabs.tabs[tabid].active = true;
    }
  }

  // using to validate from 

  validateForm(fieldName) {
    if (this.valForm.invalid) {
      this.valForm.get(fieldName).markAsTouched();
      var value1 = this.valForm.controls[fieldName].status
      return value1;
    }
  }
  // using to go to previous tab
  goToPreviousTab(event, tabid) {
    event.preventDefault()
    this.staticTabs.tabs[tabid].active = true;
  }

  // using to disable tab , user have to go step by step 
  disableTab() {
    this.staticTabs.tabs[1].disabled = !this.staticTabs.tabs[1].disabled;
    this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled;
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
        this.settingActive = 0;
        this.selectedLocation = "",
          this.valForm.reset()
        this.tags = []
        this.getSerpList()
      }
    });
  }
  showSpinnerLocationContent:boolean;
  current_loc_code:any;
  current_loc_name:any;
  locIsSelected:boolean;


  public setSelectedLocation(event) {
    
    this.locIsSelected=true;
    event.preventDefault();
    let clc = country.filter((clc) => clc.country_iso_code === this.valForm.value.location);
    this.current_loc_code=clc[0].location_code+"";
    this.current_loc_name=clc[0].location_name;
    if (this.valForm.value.location !== null) {

      this.isoCode = this.valForm.value.location;
      this.getSerpLocations();
      this.showSpinnerLocationContent=true;
      this.showLocationStates=false;
      this.showLocationCities = false;
     
     
    }
  }


  public onClick(event): any {

  }
  //using to open add keyword component
  public onClickToAddKeyword(event) {
    this.settingActive = 1;
    this.selectedLocation = ""
  }

  //using to close add keyword component
  public closeAddKeyword(event) {
    event.preventDefault()
    this.settingActive = 0;
    this.selectedLocation = "",
      this.valForm.reset()
    this.tags = []
    if (this.queryParams != undefined) {
      this.queryParams = undefined;
      this.router.navigate(['home/overview/', { id: this.selectedCampId }])

    }


  }

  //using to open div on mouseover event
  public showDiv(event, value, show) {
    this.showdiv = value == 'true' ? true : false;
    this.show = show;

  }

  // using to go to next on press enter in keyword input
  triggerFunction(event) {
    if (event.key === 'Enter') {
      /*
        cannot make textarea produce a next line.
      */
      var text = document.getElementById("textarea1");
      text['value'] += '\n';
      //  text = text.

    } else if (event.key !== 'Enter') {
      event.preventDefault();
    }
  }

  // using to focus on tag input
  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  // using to catch event from tag input 
  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.valForm.controls.tag.value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space') {
        this.addTag(inputValue);
        this.valForm.controls.tag.setValue('');
      }
    }
  }

  // using to add tag in form input tag
  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
    }
  }
  // using to remove added tag
  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
  }
  // using to add new keywords
  goToAddNewKeywords(): void {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo/keywords`,])
  }

  public goToAnalyticsOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics`])
  }
  public goToAcquisiton(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition`])
  }
  public goToAcquisitonTrafficSources(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition/traffic-sources`])
  }
  public goToAcquisitonSourcesMediums(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition/sources-mediums`])
  }
  public goToAcquisitonCampaigns(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/acquisition/campaigns`])
  }

  public goToAudience(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience`])
  }
  public goToAudienceDeviceCategory(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience/device-category`])
  }
  public goToAudienceGeoLocations(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience/geolocation`])
  }
  public goToAudienceLanguages(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/audience/languages`])
  }
  public goToBehavior(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior`])
  }
  public goToBehaviorLandingPages(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior/landing-pages`])
  }
  public goToBehaviorEvent(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior/events`])
  }
  public goToBehaviorSiteSpeed(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/behavior/site-speed`])
  }
  public goToConversions(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/conversions`])
  }
  public goToConversionseCommerce(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/conversions/ecommerce`])
  }
  public goToConversionsGoals(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/analytics/conversions/goals`])
  }
  public goToSeoOverview(event) {
    this.router.navigate([`/campaign/:id${this.selectedCampId}/seo`])
  }

  public convertToShortNumber(labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

      ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
      // Six Zeroes for Millions 
      : Math.abs(Number(labelValue)) >= 1.0e+6

        ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3

          ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

          : Math.abs(Number(labelValue));

  }

  //Edit,Delete Keyword
  onCustomAction(event) {
    switch (event.action) {
      case 'deleteKeyword':
        this.deleteKeyword(event.data);
    }
  }

  //Delete campaign
  deleteKeyword(event) {
    success({
      icon: this.translate.instant('sweetalert.WARNINGICON'),
      title: this.translate.instant('message.DELETEMSG'),
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
    }).then((isConfirm: any) => {
      if (isConfirm) {
        this.campaignService.deleteKeywordById(event.id).subscribe(res => {
          success({
            icon: this.translate.instant('sweetalert.WARNINGICON'),
            title: this.translate.instant('message.DELETEMSG'),
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
              this.router.navigate([`/campaign/:id${this.selectedCampId}/seo`])
            }
          })
        });
      } else {
        success({
          icon: this.translate.instant('sweetalert.WARNINGICON'),
          title: this.translate.instant('message.CANCLEMSG'),
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
          this.router.navigate([`/campaign/:id${this.selectedCampId}/seo`])
        })
      }
    });
  }
  selectedState: any;
  changedIsoCode:any;
  temp_loc_code:any;
  showLocationCities:boolean=false;
  showLocationStates:boolean=false;
  setSelectedLocationState(event) {
    ;
    event.preventDefault;
    this.changedIsoCode=this.valForm.value.location
    this.selectedState = event;
    this.current_loc_code=event;
    this.getSerpLocations();
    this.showSpinnerLocationContent = true;
  }
  setSelectedLocationCity(event){
    ;
    event.preventDefault;
    this.temp_loc_code=event.split(",")
    this.current_loc_code=this.temp_loc_code[0];
    this.current_loc_name = this.temp_loc_code[1] + "," + this.current_loc_name;
  }
  getSerpLocations() {

    this.campaignService.getSerpLocations(this.isoCode).subscribe((res) => { 
      
      let result;
      result = res;

      let x = result.map((h) => {
        var z = h.location_name.split(",");
        h.location_name = z[0];
        return h;
      });

      if (this.selectedState == null||(this.changedIsoCode!==this.isoCode)) {
       
        let a = x.filter((a) => a.location_type == "Union Territory");
        let b = x.filter((b) => b.location_type == "State");
        let c = x.filter((b) => b.location_type == "Province");
        let d = (a.concat(b)).concat(c);
        this.showSpinnerLocationContent = false;
        this.state = d;
        this.showLocationStates=true;
      }
     
      if (this.selectedState!== null || (this.changedIsoCode !== this.isoCode)) {
       
        let j = x.filter((j) => j.location_code == this.selectedState)
        let m = j[0].location_code;
        this.current_loc_name=j[0].location_name+","+x[0].location_name;
        let e = result.filter((e) => e.location_type == "City");
        let f = result.filter((f) => f.location_type == "District");
        let g = e.concat(f);
        let n = g.filter((n) => n.location_code_parent == m);
        this.showSpinnerLocationContent = false;
        this.cities = n;
        this.showLocationCities = true;
      }
    });
  }
}