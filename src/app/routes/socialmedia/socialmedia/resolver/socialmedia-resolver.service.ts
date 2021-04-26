import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';

import { map, catchError } from 'rxjs/operators';
import { FilterOptionModel } from 'app/shared/models/filter-option.model';
import { CoreService } from 'app/shared/services/core.service';
import { OpenIdConnectService } from 'app/shared/services/open-id-connect.service';


@Injectable({
    providedIn: 'root'
})
export class AttendeeResolver {

    eventId;
    currentUserId;

    Url = environment.apiUrl;
    constructor(private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private coreService: CoreService,  private openIdConnectService: OpenIdConnectService) {      
            this.openIdConnectService = openIdConnectService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        
        this.eventId =localStorage.getItem('eventId');

        const filterOptionModel = this.getFilterOptionModel(this.eventId );
        const filterAttendeeModel = this.getFilterOptionModel(this.eventId );
        const userFilterOptionModel = this.getUserFilterOptionModel(this.eventId );
        const userFilterOptionModelCurr = this.getUserFilterOptionModelCurrent(this.eventId );

        const userList = this.getFilteredUsers(userFilterOptionModel);
        const attendeeProfilesList = this.getFilteredAttendeeProfiles(filterAttendeeModel);
        const currentUserData = this.getFilteredUsers(userFilterOptionModelCurr);
        const filterAttendeeModelatt = this.getAttendeeFilterOptionModelCurrent(this.eventId );
        const currentAttendeeData = this.getFilteredAttendeeProfiles(filterAttendeeModelatt);

        return forkJoin([userList, attendeeProfilesList, currentUserData, currentAttendeeData]).pipe(map(res => {
            if (res) {
                return {
                    users: res[0].body,
                    attendeeProfiles: res[1].body,
                    curentuserdata: res[2].body,   
                    currentattendee: res[3].body,   
                }
            }
            return null; // map returns value as an observable so we don't need to use of
        }));
    }


    //Scheduled Sessions
    getFilteredUsers(filter: FilterOptionModel): Observable<any> {
        const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
        return this.http.get<any>(`${this.Url}aspusers?${params}`, { observe: 'response' });
    }
    //Scheduled Sessions
    getFilteredAttendeeProfiles(filter: FilterOptionModel): Observable<any> {
        const params = `PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}&SearchQuery=${filter.searchQuery}&OrderBy=${filter.orderBy}&Fields=${filter.fields}`;
        return this.http.get<any>(`${this.Url}attendeeprofiles?${params}`, { observe: 'response' });
    }

    private getFilterOptionModel(id) {

        return {
            pageNumber: 1,
            pageSize: 1000,
            fields: '',
            searchQuery: 'EventId=="' + id + '"',
            orderBy: ''
        }

    }

    private getUserFilterOptionModel(id) {

        return {
            pageNumber: 1,
            pageSize: 1000,
            fields: '',
            searchQuery: 'EventId=="' + id + '"',
            orderBy: ''
        }

    }
    private getUserFilterOptionModelCurrent(id) {

        return {
            pageNumber: 1,
            pageSize: 1000,
            fields: '',
            searchQuery: 'EventId=="' + id + '"',
            orderBy: ''
        }

    }
    private getAttendeeFilterOptionModelCurrent(id) {

        return {
            pageNumber: 1,
            pageSize: 1000,
            fields: '',
            searchQuery: 'EventId=="' + id + '"',
            orderBy: ''
        }

    }

}
