import { Component, OnInit } from '@angular/core';
import { IntegrationsService } from '../integrations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAnalyticsAccountSetups } from '../googleAnalyticsAccount.model';
import { CampaignService } from '../../campaign/campaign.service';
import { TranslateService } from '@ngx-translate/core';
import { Campaign } from '../../campaign/campaign.model';
const success = require('sweetalert');
import { OpenIdConnectService } from '../../../shared/services/open-id-connect.service';


@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {

  selectedCampId:string;
  public googleAnalyticsAccountSetupList : GoogleAnalyticsAccountSetups[];
  hasGaSetup: boolean = false;
  gaAccounts : any;
  profiles: any;

  userName: any = 'userName';

  selectedAccount: any ;
  activeAccount:any;
  
  selectedProfile : any;
  activeProfile:any;

  isVisible:boolean= true;
  selectedCampaignName:string;
  campaignList: Campaign[];

  

  constructor(private translate: TranslateService,private openIdConnectService: OpenIdConnectService, private integrationsService : IntegrationsService ,private router: Router,private route :ActivatedRoute
    ,private campaignService: CampaignService,) { 
      this.getCampaignList();
      let id = this.route.snapshot.paramMap.get('id');
      this.selectedCampId = `${id}`;
    }

  

  ngOnInit(): void {

    this.getGaSetupByCampaignId();
    
  }

  public integrationData : any;

  googleAuth(): void {
    
    this.integrationsService.googleAuth(this.selectedCampId).subscribe(
      res => {
        debugger
        this.integrationData = res; 
        this.getGaSetupByCampaignId();

     });  

  };

  googleAdsAuth(): void{
    this.integrationsService.googleAdsAuth(this.selectedCampId).subscribe(

      googleAuthUrl => {
           window.location = googleAuthUrl;
     });  


  }

    // using to get google analytics setup of selected campaign Id
  public getGaSetupByCampaignId(): void{



    this.integrationsService.getGaSetupByCampaignId(this.selectedCampId).subscribe(

      res => {
        debugger
        this.googleAnalyticsAccountSetupList = res;
        if(this.googleAnalyticsAccountSetupList && this.googleAnalyticsAccountSetupList.length > 0 ){

          this.hasGaSetup = true;
        }
        else {
          this.hasGaSetup = false;
        }
        // using to get unique value from response
        var gaAccounts =  this.googleAnalyticsAccountSetupList.map(function (item) { return  item.googleAccountSetups; });   
        this.gaAccounts = gaAccounts.filter((thing, index, self) =>
        index === self.findIndex((t) => (
           t[this.userName] === thing[this.userName]
        ))
      )
        
        //distinct google account
        
        
        
        this.activeAccount = this.googleAnalyticsAccountSetupList.map(function (item) {   
                if(item.active == true){
                  return item.googleAccountSetups;
                }
           })[0];

           if(this.activeAccount){
            this.selectedAccount = this.activeAccount;
            //Active profile selection
              this.activeAccountSelection(this.activeAccount.id);
           }else{
            this.selectedAccount = this.gaAccounts[0];
            //Active profile selection
             this.activeAccountSelection(this.selectedAccount.id);
           }
           //Active account selection
        
        
       
        
        
      });
  };

  activeAccountSelection(id) {
    debugger
    this.profiles = this.googleAnalyticsAccountSetupList.filter((item) => item.googleAccountSetupID == id);

    this.activeProfile =  this.profiles.filter((item) => item.active == true)[0];

    if(this.activeProfile){
      this.selectedProfile = this.activeProfile;
     }else{
      this.selectedProfile = this.profiles[0];
     }

  }

  onSelect(id) {
    this.profiles = this.googleAnalyticsAccountSetupList.filter((item) => item.googleAccountSetupID == id);

  }

  saveProfile(){

    this.integrationsService.updateGaAccountProfile( this.selectedProfile.id ,this.selectedCampId).subscribe(


      res => {
       this.successAlert()
      });
    
  }
   
  successAlert() {
    success({
        icon: this.translate.instant('sweetalert.SUCCESSICON'),
        title: this.translate.instant('message.SAVEMSG'),
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
          this.router.navigate(['/integrations', this.selectedCampId]);
        }
    });
}
  // using to get campaignList
  public getCampaignList(): void {
    
    var userid = this.openIdConnectService.user.profile.sub;
    this.campaignService.getCampaign(userid).subscribe(res => {
      
        this.campaignList = res;   
        var name = "";
        if(this.selectedCampId == ":id"){
          this.selectedCampId = this.campaignList[0].id
        }
        this.campaignList.map((s,i)=>{
          if(s.id == this.selectedCampId){
            name = s.name
          }
        })
        this.selectedCampaignName = name !== "" ? name : undefined ; 
          // this.getGaSetupByCampaignId()  
          this.router.navigate(['/integrations', this.selectedCampId]); 
    });
}

// using to get integration status of selected campaign Id
public onCampaignSelect(event,selectedCampaign) {
  this.selectedCampaignName = selectedCampaign.name
  this.selectedCampId = selectedCampaign.id
  this.router.navigate(['/integrations', this.selectedCampId]);
  this.getGaSetupByCampaignId()
}

}
