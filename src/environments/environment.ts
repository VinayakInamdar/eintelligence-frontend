// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  //client id secret for abhisihelpdesk@gmail.com
  googleClientId:'959505317275-v8294ho5b3prni9rqi4l6nnb8463uiig.apps.googleusercontent.com',
  googleClientSecret : 'JNCBlNi2j-o5sob6qL6Q8Ead',
  googleRedirectUrl : 'https://localhost:4200/home/campaign',
  production: false,
  apiUrl: 'https://localhost:44357/api/',
  //my stripe key
  stripe_key: 'pk_test_51I0iLaEKoP0zJ89QGXq8ihvypBEzyryF6Y5Hiro0UDcPLQeCTzA0v8S6lYv2DNBZZS3LxICWKJATbOxzdUCOl73p00Her3EA2b',
  stripe_secreTkey: 'sk_test_51I0iLaEKoP0zJ89QzP2qwrKaIC8vjEfoVim8j4S0Y3FsRx0T3UEkvqiaEayt1AzAcP7Na5xzZcb7aN2K7aMrtcMf00CizHVXeg',
 // office keys test 
  // stripe_key: 'pk_test_L4apfqRUqsnf9DlZceFAy4Wx',
  // stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
  //office keys Live 
  // stripe_key: 'pk_live_iaYYzGaqQ7BZGhoNMkvqrjX2',
  // stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
  // Facebook Techovarya keys
  facebook_clientToken: '8297e1f6d032164c4d94a205387bf171',
  facebook_appSecret: 'e2b6565db23b735aff9f7c5536dbb217',//rpatelchati@gmail.com
  facebook_appid: '200487178533939',//rpatelchati@gmail.com
  facebook_appToken: '448186179555932|GnYxyy4pqi6B_f49gfVUkVwrMfM',
  facebook_userToken: 'EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD',
  facebook_pageid : '102988865108273',//my

  insta_appid:'1381661432190657',
  insta_appsecret:'8ea9a028b1769762186b048705755b6b',
  insta_redirecturl:'https://localhost:4200/home',
  //user id= 105114094889635
  openIdConnectSettings: {
    authority: 'https://localhost:44349/',
    client_id: 'tourmanagementclient',
    redirect_uri: 'https://localhost:4200/signin-oidc',
    scope: 'openid profile roles tourmanagementapi',
    response_type: 'id_token token',
    post_logout_redirect_uri: 'https://localhost:4200/',
  },
};
// export const environment = {
//   production: true,
//   apiUrl: 'https://eintelligencebackend.azurewebsites.net/api/',
//   openIdConnectSettings: {
//     authority: 'https://eintelligenceidentity.azurewebsites.net/',
//     client_id: 'tourmanagementclient',
//     redirect_uri: 'https://localhost:4200/signin-oidc',
//     scope: 'openid profile roles tourmanagementapi',
//     response_type: 'id_token token',
//     post_logout_redirect_uri: 'https://localhost:4200/',
//   },
// };


// export const environment = {
//     //client id secret for abhisihelpdesk@gmail.com
//    googleClientId:'959505317275-v8294ho5b3prni9rqi4l6nnb8463uiig.apps.googleusercontent.com',
//    googleClientSecret : 'JNCBlNi2j-o5sob6qL6Q8Ead',
// googleRedirectUrl : 'https://localhost:4200/home/campaign',
//   production: true,
//   stripe_key: 'pk_test_L4apfqRUqsnf9DlZceFAy4Wx',
//   stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
// facebook_clientToken: '8297e1f6d032164c4d94a205387bf171',
// facebook_appSecret: 'c487f4d66242b62431eb4bb26d785b84',
// facebook_appid: '448186179555932',//my
// //facebook_appid: '469648937364794', //abhisi,//
// facebook_appToken: '448186179555932|GnYxyy4pqi6B_f49gfVUkVwrMfM',
// facebook_userToken: 'EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD',
// //facebook_pageid : '492281704520919',//abhisi',
// facebook_pageid : '102988865108273',//my
//   apiUrl: 'https://eintelligencebackend.azurewebsites.net/api/',
//   openIdConnectSettings: {
//     authority: 'https://eintelligenceidentity.azurewebsites.net/',
//     client_id: 'tourmanagementclient',
//     redirect_uri: 'https://localhost:4200/signin-oidc',
//     scope: 'openid profile roles tourmanagementapi',
//     response_type: 'id_token token',
//     post_logout_redirect_uri: 'https://localhost:4200/',
//   },
// };
 


// export const environment = {
//   //client id secret for abhisihelpdesk@gmail.com
//  googleClientId:'959505317275-v8294ho5b3prni9rqi4l6nnb8463uiig.apps.googleusercontent.com',
//  googleClientSecret : 'JNCBlNi2j-o5sob6qL6Q8Ead',
// googleRedirectUrl : 'https://localhost:4200/home/campaign',
// insta_appid:'1381661432190657',
// insta_appsecret:'8ea9a028b1769762186b048705755b6b',
// insta_redirecturl:'https://localhost:4200/home',
// production: true,
// stripe_key: 'pk_test_51I0iLaEKoP0zJ89QGXq8ihvypBEzyryF6Y5Hiro0UDcPLQeCTzA0v8S6lYv2DNBZZS3LxICWKJATbOxzdUCOl73p00Her3EA2b',
// stripe_secreTkey: 'sk_test_51I0iLaEKoP0zJ89QzP2qwrKaIC8vjEfoVim8j4S0Y3FsRx0T3UEkvqiaEayt1AzAcP7Na5xzZcb7aN2K7aMrtcMf00CizHVXeg',
// facebook_clientToken: '8297e1f6d032164c4d94a205387bf171',
// facebook_appSecret: 'c487f4d66242b62431eb4bb26d785b84',
// facebook_appid: '448186179555932',//my
// //facebook_appid: '469648937364794', //abhisi,//
// facebook_appToken: '448186179555932|GnYxyy4pqi6B_f49gfVUkVwrMfM',
// facebook_userToken: 'EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD',
// //facebook_pageid : '492281704520919',//abhisi',
// facebook_pageid : '102988865108273',//my
// apiUrl: 'https://eintelligencebackend.azurewebsites.net/api/',
// openIdConnectSettings: {
//   authority: 'https://eintelligenceidentity.azurewebsites.net/',
//   client_id: 'tourmanagementclient',
//   redirect_uri: 'https://localhost:4200/signin-oidc',
//   scope: 'openid profile roles tourmanagementapi',
//   response_type: 'id_token token',
//   post_logout_redirect_uri: 'https://localhost:4200/',
// },
// };


/*

* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
