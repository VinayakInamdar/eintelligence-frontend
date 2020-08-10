import { Component, OnInit } from '@angular/core';
import { IntegrationsService } from '../integrations.service';
import { GoogleAccountSetups } from '../googleAccountSetups.model';
import { ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsAccountSetups } from '../googleAnalyticsAccount.model';

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

  selectedAccount: any ;
  activeAccount:any;
  
  selectedProfile : any;
  activeProfile:any;

  isVisible:boolean= true;

  

  constructor(private integrationsService : IntegrationsService ,private route :ActivatedRoute) { }

  

  ngOnInit(): void {
    this.getGaSetupByCampaignId();
  }

  public integrationData : any;

  googleAuth(): void {

    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;

    this.integrationsService.googleAuth(this.selectedCampId).subscribe(

      res => {
        this.integrationData = res; 
        this.getGaSetupByCampaignId();

     });  

  };

  public getGaSetupByCampaignId(): void{

    let id = this.route.snapshot.paramMap.get('id');
  this.selectedCampId = `${id}`;

    this.integrationsService.getGaSetupByCampaignId(this.selectedCampId).subscribe(

      // this.states = this.selectService.getStates().filter((item) => item.countryid == countryid);

      res => {
        this.googleAnalyticsAccountSetupList = res;
        if(this.googleAnalyticsAccountSetupList && this.googleAnalyticsAccountSetupList.length > 0 ){

          this.hasGaSetup = true;
        }
        this.gaAccounts =  this.googleAnalyticsAccountSetupList.map(function (item) { return  item.googleAccountSetups; });        
        
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

    let id = this.route.snapshot.paramMap.get('id');
    this.selectedCampId = `${id}`;

    this.integrationsService.updateGaAccountProfile( this.selectedProfile.id ,this.selectedCampId).subscribe(

      // this.states = this.selectService.getStates().filter((item) => item.countryid == countryid);

      res => {
       
      });
    
  }

}
