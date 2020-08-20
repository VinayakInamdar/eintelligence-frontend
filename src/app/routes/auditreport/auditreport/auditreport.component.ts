import { Component, OnInit } from '@angular/core';
import { OverviewService } from '../../overview/overview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../../campaign/campaign.service';
import { IntegrationsService } from '../../integrations/integrations.service';
import { AuditsService } from '../../audits/audits.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-auditreport',
  templateUrl: './auditreport.component.html',
  styleUrls: ['./auditreport.component.scss']
})
export class AuditreportComponent implements OnInit {
  progressbartype : string = 'success';
  securitySection : object;
  selectedTaskId: string;
  organicTrafficSection: [object];
  showSpinner:boolean = false;
  technical_seo : object;
  on_page_seo : object;
  summary = 'summary';
  pages = 'pages';
  looking
  critical : object = {
    organic_traffic : '',
    security : '',

  };
  for_improvement : object = {
    organic_traffic : '',
    security : '',

  };;
  looking_good : object  = {
    organic_traffic : '',
    security : '',

  };;

  constructor(private route : ActivatedRoute, private router: Router, private integrationsService : IntegrationsService,
    private overvieswService : OverviewService,public campaignService: CampaignService,
    public auditsService:AuditsService,private _location: Location ) {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedTaskId = `${id}`;
   }

  ngOnInit(): void {
    this.getOnPageReport()
  }

  // using to get onPageReport of selected taskId
  getOnPageReport() {
    this.showSpinner = true;
 this.auditsService.getOnPageData(this.selectedTaskId).subscribe(res=>{
      var technical_seo = {}
      var on_page_seo = {}
      res[this.summary].map((s,i)=>{
         this.securitySection = {
           ssl: s.ssl,
           sslcertificate : s.ssl_certificate_valid
         }

          this.technical_seo = {
            have_sitemap : s.have_sitemap,
            have_robots : s.have_robots
           }
          //  this.organicTrafficSection.push(this.technical_seo)
         
      })
      res[this.pages].map((s,i)=>{
        if(i==0) {
            this.on_page_seo = {
            h1_count : s.h1_count,
            h2_count : s.h2_count,
            h3_count : s.h3_count,
            meta_description : s.meta_description,
            meta_description_length : s.meta_description_length,
            title: s.title,
            title_length : s.title_length,

          }
        }
        // this.organicTrafficSection.push(this.on_page_seo)
      })
      this.calculateReportData()
      this.showSpinner = false;
    })
  }

  // using to navigate back to audit page
  public navigateBack(event) {
    this._location.back();
  }

   // using to calculate report data for generarl info section
   public calculateReportData(){
    this.looking_good['security'] = this.securitySection['ssl'] == true ? 1 : 0;
    this.looking_good['security'] = this.securitySection['sslcertificate'] == true ? this.looking_good['security'] + 1 : this.looking_good['security'];
    this.looking_good['organic_traffic'] = this.technical_seo['have_sitemap'] == true ? 1 : 0;
    this.looking_good['organic_traffic'] = this.technical_seo['have_robots'] == true ? this.looking_good['organic_traffic'] + 1 : this.looking_good['organic_traffic'];
    this.looking_good['organic_traffic'] = this.on_page_seo['title_length']  > 65 ? this.looking_good['organic_traffic'] + 1 : this.looking_good['organic_traffic'];
    this.looking_good['organic_traffic'] = this.on_page_seo['meta_description_length']  > 150 ? this.looking_good['organic_traffic'] + 1 : this.looking_good['organic_traffic'];
    this.looking_good['organic_traffic'] = this.on_page_seo['h1_count'] + this.on_page_seo['h2_count'] + this.on_page_seo['h3_count']   > 15 ? this.looking_good['organic_traffic'] + 1 : this.looking_good['organic_traffic'];
    this.for_improvement['security'] = 0;
    this.for_improvement['organic_traffic'] = this.on_page_seo['title_length']  <= 65 && this.on_page_seo['title_length']  > 35 ?  1 : 0;
    this.for_improvement['organic_traffic'] = this.on_page_seo['meta_description_length']  <= 150 && this.on_page_seo['meta_description_length']  > 90 ? this.for_improvement['organic_traffic']  + 1 : this.for_improvement['organic_traffic'];
    this.for_improvement['organic_traffic'] = this.on_page_seo['h1_count'] + this.on_page_seo['h2_count'] + this.on_page_seo['h3_count']   >= 5 && this.on_page_seo['h1_count'] + this.on_page_seo['h2_count'] + this.on_page_seo['h3_count']   <= 15  ? this.for_improvement['organic_traffic'] + 1 : this.for_improvement['organic_traffic'];
    this.critical['security'] = this.securitySection['ssl'] == false ? 1 : 0;
    this.critical['security'] = this.securitySection['sslcertificate'] == false ? this.critical['security'] + 1 : this.critical['security'];
    this.critical['organic_traffic'] = this.technical_seo['have_sitemap'] == false ? 1 : 0;
    this.critical['organic_traffic'] = this.technical_seo['have_robots'] == false ? this.critical['organic_traffic'] + 1 : this.critical['organic_traffic'];
    this.critical['organic_traffic'] = this.on_page_seo['title_length']  <= 35 ? this.critical['organic_traffic'] + 1 : this.critical['organic_traffic'];
    this.critical['organic_traffic'] = this.on_page_seo['meta_description_length']  <= 90 ? this.critical['organic_traffic'] + 1 : this.critical['organic_traffic'];
    this.critical['organic_traffic'] = this.on_page_seo['h1_count'] + this.on_page_seo['h2_count'] + this.on_page_seo['h3_count'] < 5 ? this.critical['organic_traffic'] + 1 : this.critical['organic_traffic'];

   }
   

}
