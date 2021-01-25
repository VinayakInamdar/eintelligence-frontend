import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-gscdata',
  templateUrl: './gscdata.component.html',
  styleUrls: ['./gscdata.component.scss']
})
export class GscdataComponent implements OnInit {
  
  constructor(private authService: SocialAuthService) {

   }
   
   signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email'
    }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
debugger
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
    .then((res) => {
      debugger
      console.log('Logged in', res);
      let  accessToken = res['authToken'];
      let  idToken = res['idToken'];
      alert(accessToken + "----------------------" + idToken)

    })
    //.then(x => console.log(x));
  }
 
  ngOnInit() {

}

}
