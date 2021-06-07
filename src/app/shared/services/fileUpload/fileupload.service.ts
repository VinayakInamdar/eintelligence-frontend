import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { environment } from '.././../../../environments/environment';
import { OpenIdConnectService } from '.././open-id-connect.service';
@Injectable({
    providedIn: 'root'
})

export class FileUploadService {
    Url = environment.apiUrl;

    constructor(private http: HttpClient, private openIdConnectService: OpenIdConnectService) {
        this.openIdConnectService = openIdConnectService;
    }

    uploadFile(data): Observable<any> {
        return this.http.post<any>(this.Url + 'attachments/UploadAttachment', data);
    }
}
