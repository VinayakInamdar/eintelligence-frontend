import { Input } from '@angular/core';
import * as _ from 'lodash';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthorityService } from '../authority.service';
import { Authority } from '../authority.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-authority',
    templateUrl: './authority.component.html',
})
export class AuthorityComponent implements OnInit {

    //@Output use for deliver Authority Name
    @Output() onSelect = new EventEmitter<string>();
    
    @Input() disabled:boolean;

    //@Input use for take Authority Name
    @Input() authorityName: string;

    public authority: Authority[];
    public authorityModel: Authority;
    textvalue: string = "";
    valForm: FormGroup;

    constructor(private authorityService: AuthorityService, fb: FormBuilder) {
        this.valForm = fb.group({
            'Name': [null, Validators.required],
        })
    }
    public ngOnInit(): void {
        this.getAuthority();
    }

    //Get Authority List
    getAuthority() {
        this.authorityService.getAuthorityList().subscribe((res => {
            this.authority = res;
        }));
    }

    //Use For type value into dropdown
    typed($event) {
        this.textvalue = $event;
    }

    //Use for Authority Name selected
    selectAuthority($event) {
        this.onSelect.emit($event);
    }

    //Created Authority List
    createAuthority(AuthorityName: string) {
        var authoritylist = new Authority();
        authoritylist.Name = AuthorityName;
        this.authorityService.createAuthority(authoritylist).subscribe((res: Authority) => {
            this.authorityModel = res;
            this.authority.push(res);
            //validation
            event.preventDefault();
            for (let c in this.valForm.controls) {
                this.valForm.controls[c].markAsTouched();
            }
            if (this.valForm.valid) { }
        });
    }
}


