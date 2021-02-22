import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SerpDto } from '../seo/serp.model';
import { OpenIdConnectService } from 'src/app/shared/services/open-id-connect.service';
import { FilterOptionModel } from '../../shared/model/filter-option.model';
@Injectable({
  providedIn: 'root'
})

export class GoogleAdsService {

    
}