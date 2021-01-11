// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  apiUrl: 'https://localhost:44357/api/',
   //my stripe key
  // stripe_key: 'pk_test_51I0iLaEKoP0zJ89QGXq8ihvypBEzyryF6Y5Hiro0UDcPLQeCTzA0v8S6lYv2DNBZZS3LxICWKJATbOxzdUCOl73p00Her3EA2b',
  // stripe_secreTkey: 'sk_test_51I0iLaEKoP0zJ89QzP2qwrKaIC8vjEfoVim8j4S0Y3FsRx0T3UEkvqiaEayt1AzAcP7Na5xzZcb7aN2K7aMrtcMf00CizHVXeg',
  //office keys test 
  stripe_key: 'pk_test_L4apfqRUqsnf9DlZceFAy4Wx',
  stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
    //office keys Live 
    // stripe_key: 'pk_live_iaYYzGaqQ7BZGhoNMkvqrjX2',
    // stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
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
//   production: false,
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
//   production: false,
//   apiUrl: 'https://eintelligencebackend.azurewebsites.net/api/',
//   openIdConnectSettings: {
//     authority: 'https://eintelligenceidentity.azurewebsites.net/',
//     client_id: 'tourmanagementclient',
//     redirect_uri: 'https://eintelligence.azurewebsites.net/signin-oidc',
//     scope: 'openid profile roles tourmanagementapi',
//     response_type: 'id_token token',
//     post_logout_redirect_uri: 'https://eintelligence.azurewebsites.net/',
//   },
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
