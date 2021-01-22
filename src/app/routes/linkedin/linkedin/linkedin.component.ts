import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

//import { LinkedInService } from 'angular-linkedin-sdk';
@Component({
  selector: 'app-linkedin',
  templateUrl: './linkedin.component.html',
  styleUrls: ['./linkedin.component.scss']
})
export class LinkedinComponent implements OnInit {

  //constructor(private _linkedInService: LinkedInService) { }
  constructor(private http: HttpClient) { }

  public isUserAuthenticated;
  apiKey;
  ngOnInit() {

  }
  // public getApiKeyFromSdkIN() {
  //   // Retrieve the API key used in the library through the SDK IN variable
  //   this.apiKey = this._linkedInService.getSdkIN().ENV.auth.api_key;
  // }
  // public subscribeToLogin(){
  //   debugger
  //   this._linkedInService.login().subscribe({
  //     next: (state) => {
  //       // state will always return true when login completed 
  //     },
  //     complete: () => {
  //       // Completed
  //     }
  //   });
  // }
  // public login() {
  //   debugger
  //   this._linkedInService.login().subscribe({
  //     next: (state) => {
  //       debugger
  //       console.log(`Login result: ${state}`);
  //     }
  //   });
  // }


  connectToLinkedIn() {
    debugger
    let client_id = '77rl4v6oym4y16';
    let redirect_uri = encodeURI("https://localhost:4200/linkedin");
    //GET https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={your_client_id}&redirect_uri=https%3A%2F%2Fdev.example.com%2Fauth%2Flinkedin%2Fcallback&state=fooobar&scope=r_liteprofile%20r_emailaddress%20w_member_social
		//	let url = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77rl4v6oym4y16&redirect_uri=https://localhost:4200/linkedin&scope=r_emailaddress,r_liteprofile';

    // let url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
    let url = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=r_emailaddress,r_liteprofile';
    this.http.get(url).subscribe(res => {
      if (res) {
        debugger
      }
    }, error => {
      alert(error.message);
    });
    // let url = "https://www.linkedin.com/oauth/v2/accessToken";
    // let body = {
    // 	grant_type:"authorization_code",
    // 	code:"AQQkyz3W6F58reu6QnRnXhi2l5mA6CevvQaArjhwEgjgFWE9elVAu-eesvajzCM7wrfgYKl4X_tKGkenct44x9EZii6x2646G3xbQP62K_gqPWjhj5NqkqtfAW_rIMEppAIrYnom0lwyKD8Lfs3T_fKukyWllR1GK_wNJmHrjnZbH4HR8Gjm8I9ibcZNeQ",
    // 	redirect_uri:"http://localhost:4200/component/linkedin/callback",
    // 	client_id:"866ucec32xxjp9",
    // 	client_secret:"s2bKnc6Zjet6M9ZB"
    // }
    // this.http.post(url, body).subscribe(res => {
    // 	if (res) {
    // 	}
    // }, error => {
    // 	alert(error.message);
    // });

    }
  }
